import { Request, Response } from 'express';
import { CartService } from './cart.service';
import { catchAsync } from '../../utils/catchAsync';

export class CartController {
  static getCart = catchAsync(async (req: Request, res: Response) => {
    const sessionId = (req.headers['x-session-id'] as string) || (req.query.sessionId as string);
    const cart = await CartService.getCartBySessionId(sessionId);
    res.status(200).json({
      status: 'success',
      data: { cart },
    });
  });

  static addItem = catchAsync(async (req: Request, res: Response) => {
    const sessionId = (req.headers['x-session-id'] as string) || req.body.sessionId;
    const cart = await CartService.addItemToCart(sessionId, req.body);
    res.status(200).json({
      status: 'success',
      message: 'Item added to MongoDB cart database',
      data: { cart },
    });
  });

  static updateQuantity = catchAsync(async (req: Request, res: Response) => {
    const sessionId = (req.headers['x-session-id'] as string) || req.body.sessionId;
    const itemId = req.params.itemId as string;
    const { quantity } = req.body;
    const cart = await CartService.updateItemQuantity(sessionId, itemId, quantity);
    res.status(200).json({
      status: 'success',
      message: 'Cart quantity updated in database',
      data: { cart },
    });
  });

  static removeItem = catchAsync(async (req: Request, res: Response) => {
    const sessionId = (req.headers['x-session-id'] as string) || (req.query.sessionId as string);
    const itemId = req.params.itemId as string;
    const cart = await CartService.removeItemFromCart(sessionId, itemId);
    res.status(200).json({
      status: 'success',
      message: 'Item removed from MongoDB cart database',
      data: { cart },
    });
  });

  static clearCart = catchAsync(async (req: Request, res: Response) => {
    const sessionId = (req.headers['x-session-id'] as string) || (req.query.sessionId as string);
    const cart = await CartService.clearCartBySessionId(sessionId);
    res.status(200).json({
      status: 'success',
      message: 'MongoDB cart database cleared',
      data: { cart },
    });
  });

  static calculateCart = catchAsync(async (req: Request, res: Response) => {
    const sessionId = (req.headers['x-session-id'] as string) || req.body.sessionId;
    const { items, couponCode } = req.body;
    const result = await CartService.calculateCart(sessionId, items, couponCode);
    res.status(200).json({
      status: 'success',
      data: result,
    });
  });
}
