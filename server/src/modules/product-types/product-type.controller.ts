import { Request, Response } from 'express';
import { ProductType } from './product-type.model';
import { catchAsync } from '../../utils/catchAsync';
import { AppError } from '../../utils/appError';

export class ProductTypeController {
  static getProductTypes = catchAsync(async (req: Request, res: Response) => {
    const productTypes = await ProductType.find().sort({ sortOrder: 1, createdAt: -1 });
    res.status(200).json({
      status: 'success',
      results: productTypes.length,
      data: { productTypes },
    });
  });

  static createProductType = catchAsync(async (req: Request, res: Response) => {
    const slug = req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const productType = await ProductType.create({ ...req.body, slug });
    res.status(201).json({
      status: 'success',
      message: 'Product Type created successfully',
      data: { productType },
    });
  });

  static updateProductType = catchAsync(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const productType = await ProductType.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!productType) {
      throw new AppError('Product Type not found', 404);
    }
    res.status(200).json({
      status: 'success',
      data: { productType },
    });
  });

  static deleteProductType = catchAsync(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const productType = await ProductType.findByIdAndDelete(id);
    if (!productType) {
      throw new AppError('Product Type not found', 404);
    }
    res.status(200).json({
      status: 'success',
      message: 'Product Type deleted successfully',
    });
  });
}
