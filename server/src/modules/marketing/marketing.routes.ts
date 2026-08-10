import { Router } from 'express';
import { MarketingController } from './marketing.controller';

const router = Router();

// Banners
router.route('/banners').get(MarketingController.getBanners).post(MarketingController.createBanner);
router.route('/banners/:id').patch(MarketingController.updateBanner).delete(MarketingController.deleteBanner);

// Coupons
router.route('/coupons').get(MarketingController.getCoupons).post(MarketingController.createCoupon);
router.route('/coupons/:id').patch(MarketingController.updateCoupon).delete(MarketingController.deleteCoupon);

export default router;
