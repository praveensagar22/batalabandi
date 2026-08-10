import mongoose from 'mongoose';
import { Order, IOrder } from './order.model';
import { AppError } from '../../utils/appError';

export class OrderService {
  static async getAllOrders(query: any = {}) {
    const { status, page = 1, limit = 20 } = query;
    const filter: any = {};

    if (status) {
      filter.orderStatus = status;
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Order.countDocuments(filter);

    return {
      orders,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
    };
  }

  static async getUserOrders(userId: string) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return [];
    }
    return await Order.find({ user: userId }).sort({ createdAt: -1 });
  }

  static async getOrderById(id: string) {
    const order = await Order.findById(id).populate('user', 'name email');
    if (!order) {
      throw new AppError('Order not found', 404);
    }
    return order;
  }

  static async createOrder(userId: string | undefined, data: any) {
    const validUserId = userId && mongoose.Types.ObjectId.isValid(userId) ? userId : undefined;
    return await Order.create({
      ...data,
      ...(validUserId ? { user: validUserId } : {}),
    });
  }

  static async updateOrderStatus(id: string, data: { orderStatus?: string; paymentStatus?: string }) {
    const order = await Order.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('user', 'name email');
    if (!order) {
      throw new AppError('Order not found', 404);
    }
    return order;
  }
}
