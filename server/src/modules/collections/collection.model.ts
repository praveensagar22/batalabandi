import mongoose, { Document, Schema } from 'mongoose';

export interface ICollection extends Document {
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription?: string;
  productsCount: number;
  status: 'Active' | 'Inactive' | 'Draft' | 'Archived';
  featured: boolean;
  showOnHomepage: boolean;
  homepagePriority: number;
  icon?: string;
  bannerImage?: string;
  thumbnailImage?: string;
  displayStyle?: 'Card' | 'Banner' | 'Full Width';
  marketingTagline?: string;
  buttonText?: string;
  buttonUrl?: string;
  promoLabel?: 'Best Seller' | 'Hot' | 'Trending' | 'Limited' | 'New' | 'Handmade';
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  createdAt: Date;
  updatedAt: Date;
}

const collectionSchema = new Schema<ICollection>(
  {
    name: {
      type: String,
      required: [true, 'Collection name is required'],
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
      enum: ['Active', 'Inactive', 'Draft', 'Archived'],
      default: 'Active',
    },
    featured: {
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
    icon: {
      type: String,
      default: 'Palette',
    },
    bannerImage: {
      type: String,
      default: '',
    },
    thumbnailImage: {
      type: String,
      default: '',
    },
    displayStyle: {
      type: String,
      enum: ['Card', 'Banner', 'Full Width'],
      default: 'Card',
    },
    marketingTagline: {
      type: String,
      default: '',
    },
    buttonText: {
      type: String,
      default: 'Explore Collection',
    },
    buttonUrl: {
      type: String,
      default: '/collections',
    },
    promoLabel: {
      type: String,
      default: 'Trending',
    },
    seoTitle: {
      type: String,
      default: '',
    },
    seoDescription: {
      type: String,
      default: '',
    },
    seoKeywords: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const CollectionModel = mongoose.model<ICollection>('Collection', collectionSchema);
