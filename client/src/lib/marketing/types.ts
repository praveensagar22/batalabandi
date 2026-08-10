export interface BannerItem {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  ctaText?: string;
  targetLink: string;
  position: 'Hero Carousel' | 'Category Top' | 'Homepage Popup' | 'Promo Strip';
  sortOrder: number;
  status: 'Active' | 'Scheduled' | 'Inactive';
  startDate?: string;
  endDate?: string;
  clicksCount: number;
  createdAt?: string;
}

export interface CouponItem {
  id: string;
  code: string;
  description?: string;
  discountType: 'Percentage' | 'Flat' | 'Free Shipping';
  discountValue: number;
  minPurchaseAmount: number;
  maxDiscountAmount?: number;
  usageLimit: number;
  usedCount: number;
  status: 'Active' | 'Expired' | 'Disabled';
  expiryDate?: string;
  createdAt?: string;
}
