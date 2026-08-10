import { Request, Response } from 'express';
import { PaymentService } from './payment.service';
import { catchAsync } from '../../utils/catchAsync';

export class PaymentController {
  static createRazorpayOrder = catchAsync(async (req: Request, res: Response) => {
    const { orderId } = req.body;
    const result = await PaymentService.createRazorpayOrder(orderId);
    res.status(200).json({
      status: 'success',
      message: 'Razorpay order created successfully',
      data: result,
    });
  });

  static verifyPayment = catchAsync(async (req: Request, res: Response) => {
    const order = await PaymentService.verifyPayment(req.body);
    res.status(200).json({
      status: 'success',
      message: 'Payment verified successfully! 🎉',
      data: { order },
    });
  });

  static handleWebhook = catchAsync(async (req: Request, res: Response) => {
    const signature = req.headers['x-razorpay-signature'] as string;
    const result = await PaymentService.handleWebhook(signature, req.body);
    res.status(200).json({
      status: 'success',
      data: result,
    });
  });
}
