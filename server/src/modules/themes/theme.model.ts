import mongoose, { Document, Schema } from 'mongoose';

export interface ITheme extends Document {
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription?: string;
  productsCount: number;
  status: 'Active' | 'Draft' | 'Archived';
  featured: boolean;
  trending: boolean;
  showOnHomepage: boolean;
  homepagePriority: number;
  showInNav: boolean;
  icon?: string;
  bannerImage?: string;
  thumbnailImage?: string;
  themeColor?: string;
  gradientColor?: string;
  compatibleCollections: string[];
  marketing: {
    tagline: string;
    buttonText: string;
    buttonUrl: string;
    campaignLabel?: string;
  };
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const themeSchema = new Schema<ITheme>(
  {
    name: {
      type: String,
      required: [true, 'Theme name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      default: '',
    },
    fullDescription: {
      type: String,
      default: '',
    },
    productsCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Active', 'Draft', 'Archived'],
      default: 'Active',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    trending: {
      type: Boolean,
      default: false,
    },
    showOnHomepage: {
      type: Boolean,
      default: true,
    },
    homepagePriority: {
      type: Number,
      default: 1,
    },
    showInNav: {
      type: Boolean,
      default: true,
    },
    icon: {
      type: String,
      default: 'Sparkles',
    },
    bannerImage: {
      type: String,
      default: '',
    },
    thumbnailImage: {
      type: String,
      default: '',
    },
    themeColor: {
      type: String,
      default: '#ef4444',
    },
    gradientColor: {
      type: String,
      default: 'from-red-500 to-amber-500',
    },
    compatibleCollections: {
      type: [String],
      default: ['Painted', 'Printed'],
    },
    marketing: {
      tagline: { type: String, default: '' },
      buttonText: { type: String, default: 'Explore Theme' },
      buttonUrl: { type: String, default: '/themes' },
      campaignLabel: { type: String, default: 'Trending' },
    },
    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      keywords: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

export const ThemeModel = mongoose.model<ITheme>('Theme', themeSchema);
