import crypto from 'crypto';
import Razorpay from 'razorpay';
import { env } from '../../config/env';
import { Order } from '../orders/order.model';
import { AppError } from '../../utils/appError';

// Initialize Razorpay Client with credentials
const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET,
});

export class PaymentService {
  /**
   * Create Razorpay Order securely on the server based on database order amount
   */
  static async createRazorpayOrder(orderId: string) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (order.paymentStatus === 'Paid') {
      throw new AppError('Order is already paid', 400);
    }

    const amountInPaise = Math.round(order.totalAmount * 100);

    // Call Razorpay API to create order
    try {
      const razorpayOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `receipt_${order._id.toString()}`,
        notes: {
          orderId: order._id.toString(),
        },
      });

      order.razorpayOrderId = razorpayOrder.id;
      await order.save();

      return {
        keyId: env.RAZORPAY_KEY_ID,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        orderId: order._id.toString(),
      };
    } catch (error: any) {
      console.error('Razorpay Order Creation Error:', error);
      throw new AppError(`Razorpay payment initiation failed: ${error.message || 'SDK Error'}`, 500);
    }
  }

  /**
   * Cryptographically verify Razorpay Payment Signature
   */
  static async verifyPayment(data: {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = data;

    const order = await Order.findById(orderId);
    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Generated Signature = HMAC_SHA256(razorpay_order_id + "|" + razorpay_payment_id, secret)
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    const isSignatureValid = expectedSignature === razorpaySignature;

    if (!isSignatureValid) {
      order.paymentStatus = 'Failed';
      await order.save();
      throw new AppError('Invalid payment signature! Payment verification failed.', 400);
    }

    // Payment Verified Successfully
    order.paymentStatus = 'Paid';
    order.orderStatus = 'Processing';
    order.razorpayPaymentId = razorpayPaymentId;
    order.razorpaySignature = razorpaySignature;
    await order.save();

    return order;
  }

  /**
   * Handle Razorpay Asynchronous Webhooks for automated order status updates
   */
  static async handleWebhook(signature: string, payload: any) {
    if (!signature) {
      throw new AppError('Webhook signature missing', 400);
    }

    const expectedSignature = crypto
      .createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET)
      .update(JSON.stringify(payload))
      .digest('hex');

    if (expectedSignature !== signature) {
      throw new AppError('Invalid webhook signature', 400);
    }

    const event = payload.event;
    const paymentEntity = payload.payload?.payment?.entity;

    if (!paymentEntity) {
      return { status: 'ignored' };
    }

    const razorpayOrderId = paymentEntity.order_id;
    const razorpayPaymentId = paymentEntity.id;

    if (event === 'payment.captured' || event === 'order.paid') {
      const order = await Order.findOne({ razorpayOrderId });
      if (order && order.paymentStatus !== 'Paid') {
        order.paymentStatus = 'Paid';
        order.orderStatus = 'Processing';
        order.razorpayPaymentId = razorpayPaymentId;
        await order.save();
        console.log(`[Webhook] Order ${order._id} marked as PAID via ${event}`);
      }
    } else if (event === 'payment.failed') {
      const order = await Order.findOne({ razorpayOrderId });
      if (order && order.paymentStatus !== 'Paid') {
        order.paymentStatus = 'Failed';
        await order.save();
        console.log(`[Webhook] Order ${order._id} marked as FAILED via payment.failed`);
      }
    }

    return { status: 'success' };
  }
}
