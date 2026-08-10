import { Response } from 'express';
import { OrderService } from './order.service';
import { catchAsync } from '../../utils/catchAsync';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class OrderController {
  static getOrders = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { orders, pagination } = await OrderService.getAllOrders(req.query);
    res.status(200).json({
      status: 'success',
      results: orders.length,
      pagination,
      data: { orders },
    });
  });

  static getMyOrders = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const orders = await OrderService.getUserOrders(req.user!._id.toString());
    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: { orders },
    });
  });

  static getOrder = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const order = await OrderService.getOrderById(id);
    res.status(200).json({
      status: 'success',
      data: { order },
    });
  });

  static createOrder = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?._id ? req.user._id.toString() : undefined;
    const order = await OrderService.createOrder(userId, req.body);
    res.status(201).json({
      status: 'success',
      message: 'Order placed successfully',
      data: { order },
    });
  });

  static updateOrderStatus = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const order = await OrderService.updateOrderStatus(id, req.body);
    res.status(200).json({
      status: 'success',
      message: 'Order status updated',
      data: { order },
    });
  });
}
