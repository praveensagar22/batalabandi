import { Request, Response } from 'express';
import { ThemeModel } from './theme.model';
import { catchAsync } from '../../utils/catchAsync';
import { AppError } from '../../utils/appError';

export class ThemeController {
  static getThemes = catchAsync(async (req: Request, res: Response) => {
    const themes = await ThemeModel.find().sort({ homepagePriority: 1, createdAt: -1 });
    res.status(200).json({
      status: 'success',
      results: themes.length,
      data: { themes },
    });
  });

  static createTheme = catchAsync(async (req: Request, res: Response) => {
    const slug = req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const theme = await ThemeModel.create({ ...req.body, slug });
    res.status(201).json({
      status: 'success',
      message: 'Theme created successfully',
      data: { theme },
    });
  });

  static updateTheme = catchAsync(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const theme = await ThemeModel.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!theme) {
      throw new AppError('Theme not found', 404);
    }
    res.status(200).json({
      status: 'success',
      data: { theme },
    });
  });

  static deleteTheme = catchAsync(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const theme = await ThemeModel.findByIdAndDelete(id);
    if (!theme) {
      throw new AppError('Theme not found', 404);
    }
    res.status(200).json({
      status: 'success',
      message: 'Theme deleted successfully',
    });
  });
}
