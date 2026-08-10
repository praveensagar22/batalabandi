import { Request, Response } from 'express';
import { CollectionModel } from './collection.model';
import { catchAsync } from '../../utils/catchAsync';
import { AppError } from '../../utils/appError';

export class CollectionController {
  static getCollections = catchAsync(async (req: Request, res: Response) => {
    const collections = await CollectionModel.find().sort({ homepagePriority: 1, createdAt: -1 });
    res.status(200).json({
      status: 'success',
      results: collections.length,
      data: { collections },
    });
  });

  static createCollection = catchAsync(async (req: Request, res: Response) => {
    const slug = req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const collection = await CollectionModel.create({ ...req.body, slug });
    res.status(201).json({
      status: 'success',
      message: 'Collection created successfully',
      data: { collection },
    });
  });

  static updateCollection = catchAsync(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const collection = await CollectionModel.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!collection) {
      throw new AppError('Collection not found', 404);
    }
    res.status(200).json({
      status: 'success',
      data: { collection },
    });
  });

  static deleteCollection = catchAsync(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const collection = await CollectionModel.findByIdAndDelete(id);
    if (!collection) {
      throw new AppError('Collection not found', 404);
    }
    res.status(200).json({
      status: 'success',
      message: 'Collection deleted successfully',
    });
  });
}
