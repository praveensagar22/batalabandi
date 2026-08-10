import mongoose, { Document, Schema } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  description?: string;
  discountType: 'Percentage' | 'Flat' | 'Free Shipping';
  discountValue: number;
  minPurchaseAmount: number;
  maxDiscountAmount?: number;
  usageLimit: number;
  usedCount: number;
  status: 'Active' | 'Expired' | 'Disabled';
  expiryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    discountType: {
      type: String,
      enum: ['Percentage', 'Flat', 'Free Shipping'],
      default: 'Percentage',
    },
    discountValue: {
      type: Number,
      required: true,
      default: 10,
    },
    minPurchaseAmount: {
      type: Number,
      default: 0,
    },
    maxDiscountAmount: {
      type: Number,
      default: 0,
    },
    usageLimit: {
      type: Number,
      default: 100,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Active', 'Expired', 'Disabled'],
      default: 'Active',
    },
    expiryDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const CouponModel = mongoose.model<ICoupon>('Coupon', couponSchema);
