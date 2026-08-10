import { Request, Response } from 'express';
import { CategoryService } from './category.service';
import { catchAsync } from '../../utils/catchAsync';

export class CategoryController {
  static getCategories = catchAsync(async (req: Request, res: Response) => {
    const categories = await CategoryService.getAllCategories();
    res.status(200).json({
      status: 'success',
      results: categories.length,
      data: { categories },
    });
  });

  static getCategory = catchAsync(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const category = await CategoryService.getCategoryById(id);
    res.status(200).json({
      status: 'success',
      data: { category },
    });
  });

  static createCategory = catchAsync(async (req: Request, res: Response) => {
    const category = await CategoryService.createCategory(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Category created successfully',
      data: { category },
    });
  });

  static updateCategory = catchAsync(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const category = await CategoryService.updateCategory(id, req.body);
    res.status(200).json({
      status: 'success',
      message: 'Category updated successfully',
      data: { category },
    });
  });

  static deleteCategory = catchAsync(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await CategoryService.deleteCategory(id);
    res.status(200).json({
      status: 'success',
      message: 'Category deleted successfully',
    });
  });
}
