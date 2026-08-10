import mongoose, { Document, Schema } from 'mongoose';

export interface IBanner extends Document {
  title: string;
  subtitle?: string;
  image: string;
  ctaText?: string;
  targetLink: string;
  position: 'Hero Carousel' | 'Category Top' | 'Homepage Popup' | 'Promo Strip';
  sortOrder: number;
  status: 'Active' | 'Scheduled' | 'Inactive';
  startDate?: Date;
  endDate?: Date;
  clicksCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const bannerSchema = new Schema<IBanner>(
  {
    title: {
      type: String,
      required: [true, 'Banner title is required'],
      trim: true,
    },
    subtitle: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      required: [true, 'Banner image URL is required'],
    },
    ctaText: {
      type: String,
      default: 'Shop Collection',
    },
    targetLink: {
      type: String,
      default: '/categories',
    },
    position: {
      type: String,
      enum: ['Hero Carousel', 'Category Top', 'Homepage Popup', 'Promo Strip'],
      default: 'Hero Carousel',
    },
    sortOrder: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ['Active', 'Scheduled', 'Inactive'],
      default: 'Active',
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    clicksCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const BannerModel = mongoose.model<IBanner>('Banner', bannerSchema);
