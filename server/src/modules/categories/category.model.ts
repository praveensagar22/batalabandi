import mongoose, { Document, Schema } from 'mongoose';

export interface ICategorySEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  ogImage?: string;
}

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  parentId?: mongoose.Types.ObjectId | string | null;
  gender?: 'Men' | 'Women' | 'Unisex' | 'All';
  level: number;
  productsCount: number;
  status: 'Active' | 'Inactive';
  sortOrder: number;
  image?: string;
  banner?: string;
  icon?: string;
  color?: string;
  showOnHomepage: boolean;
  featured: boolean;
  showInNav: boolean;
  displayPriority: number;
  seo?: ICategorySEO;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    parentId: {
      type: Schema.Types.Mixed,
      default: null,
    },
    gender: {
      type: String,
      enum: ['Men', 'Women', 'Unisex', 'All'],
      default: 'Unisex',
    },
    level: {
      type: Number,
      default: 0,
    },
    productsCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    sortOrder: {
      type: Number,
      default: 1,
    },
    image: {
      type: String,
      default: '',
    },
    banner: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: 'Tag',
    },
    color: {
      type: String,
      default: '#facc15',
    },
    showOnHomepage: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    showInNav: {
      type: Boolean,
      default: true,
    },
    displayPriority: {
      type: Number,
      default: 5,
    },
    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      keywords: { type: String, default: '' },
      ogImage: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

export const Category = mongoose.model<ICategory>('Category', categorySchema);
