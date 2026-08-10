import { Request, Response } from 'express';
import { AttributeModel } from './attribute.model';
import { catchAsync } from '../../utils/catchAsync';
import { AppError } from '../../utils/appError';

export class AttributeController {
  static getAttributes = catchAsync(async (req: Request, res: Response) => {
    const attributes = await AttributeModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: 'success',
      results: attributes.length,
      data: { attributes },
    });
  });

  static createAttribute = catchAsync(async (req: Request, res: Response) => {
    const slug = req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const attribute = await AttributeModel.create({ ...req.body, slug });
    res.status(201).json({
      status: 'success',
      message: 'Attribute created successfully',
      data: { attribute },
    });
  });

  static updateAttribute = catchAsync(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const attribute = await AttributeModel.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!attribute) {
      throw new AppError('Attribute not found', 404);
    }
    res.status(200).json({
      status: 'success',
      data: { attribute },
    });
  });

  static deleteAttribute = catchAsync(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const attribute = await AttributeModel.findByIdAndDelete(id);
    if (!attribute) {
      throw new AppError('Attribute not found', 404);
    }
    res.status(200).json({
      status: 'success',
      message: 'Attribute deleted successfully',
    });
  });
}
