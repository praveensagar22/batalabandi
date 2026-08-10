import { Request, Response } from 'express';
import { InventoryModel } from './inventory.model';
import { catchAsync } from '../../utils/catchAsync';
import { AppError } from '../../utils/appError';

export class InventoryController {
  static getInventory = catchAsync(async (req: Request, res: Response) => {
    const items = await InventoryModel.find().sort({ updatedAt: -1 });
    res.status(200).json({
      status: 'success',
      results: items.length,
      data: { items },
    });
  });

  static adjustStock = catchAsync(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { changeAmount, reason, note, user } = req.body;

    const item = await InventoryModel.findById(id);
    if (!item) {
      throw new AppError('Inventory item not found', 404);
    }

    const previousStock = item.availableStock;
    const newStock = Math.max(0, previousStock + Number(changeAmount));

    let status: 'In Stock' | 'Low Stock' | 'Out of Stock' = 'In Stock';
    if (newStock === 0) status = 'Out of Stock';
    else if (newStock <= item.lowStockThreshold) status = 'Low Stock';

    item.availableStock = newStock;
    item.status = status;
    item.logs.unshift({
      id: `log-${Date.now()}`,
      changeAmount: Number(changeAmount),
      previousStock,
      newStock,
      reason: reason || 'Audit Correction',
      note: note || '',
      user: user || 'Admin',
      timestamp: new Date(),
    });

    await item.save();

    res.status(200).json({
      status: 'success',
      message: 'Stock adjusted successfully',
      data: { item },
    });
  });

  static createInventoryItem = catchAsync(async (req: Request, res: Response) => {
    const item = await InventoryModel.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { item },
    });
  });

  static deleteInventoryItem = catchAsync(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await InventoryModel.findByIdAndDelete(id);
    res.status(200).json({
      status: 'success',
      message: 'Inventory item deleted',
    });
  });
}
