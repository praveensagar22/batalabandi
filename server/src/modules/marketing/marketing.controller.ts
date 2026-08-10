import { Request, Response } from 'express';
import { BannerModel } from './banner.model';
import { CouponModel } from './coupon.model';
import { catchAsync } from '../../utils/catchAsync';
import { AppError } from '../../utils/appError';

export class MarketingController {
  // Banners
  static getBanners = catchAsync(async (req: Request, res: Response) => {
    const banners = await BannerModel.find().sort({ sortOrder: 1, createdAt: -1 });
    res.status(200).json({ status: 'success', results: banners.length, data: { banners } });
  });

  static createBanner = catchAsync(async (req: Request, res: Response) => {
    const banner = await BannerModel.create(req.body);
    res.status(201).json({ status: 'success', data: { banner } });
  });

  static updateBanner = catchAsync(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const banner = await BannerModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!banner) throw new AppError('Banner not found', 404);
    res.status(200).json({ status: 'success', data: { banner } });
  });

  static deleteBanner = catchAsync(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await BannerModel.findByIdAndDelete(id);
    res.status(200).json({ status: 'success', message: 'Banner deleted' });
  });

  // Coupons
  static getCoupons = catchAsync(async (req: Request, res: Response) => {
    const coupons = await CouponModel.find().sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', results: coupons.length, data: { coupons } });
  });

  static createCoupon = catchAsync(async (req: Request, res: Response) => {
    const coupon = await CouponModel.create(req.body);
    res.status(201).json({ status: 'success', data: { coupon } });
  });

  static updateCoupon = catchAsync(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const coupon = await CouponModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!coupon) throw new AppError('Coupon not found', 404);
    res.status(200).json({ status: 'success', data: { coupon } });
  });

  static deleteCoupon = catchAsync(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await CouponModel.findByIdAndDelete(id);
    res.status(200).json({ status: 'success', message: 'Coupon deleted' });
  });
}
