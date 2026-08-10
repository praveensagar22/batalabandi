import { Request, Response } from 'express';
import { ProductService } from './product.service';
import { catchAsync } from '../../utils/catchAsync';

export class ProductController {
  static getProducts = catchAsync(async (req: Request, res: Response) => {
    const { products, pagination } = await ProductService.getAllProducts(req.query);
    res.status(200).json({
      status: 'success',
      results: products.length,
      pagination,
      data: { products },
    });
  });

  static getProduct = catchAsync(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const product = await ProductService.getProductById(id);
    res.status(200).json({
      status: 'success',
      data: { product },
    });
  });

  static createProduct = catchAsync(async (req: Request, res: Response) => {
    const product = await ProductService.createProduct(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Product created successfully',
      data: { product },
    });
  });

  static updateProduct = catchAsync(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const product = await ProductService.updateProduct(id, req.body);
    res.status(200).json({
      status: 'success',
      message: 'Product updated successfully',
      data: { product },
    });
  });

  static deleteProduct = catchAsync(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await ProductService.deleteProduct(id);
    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully',
    });
  });
}
