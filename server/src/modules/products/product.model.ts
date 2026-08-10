import mongoose, { Document, Schema } from 'mongoose';

export interface IProductVariant {
  id: string;
  sku: string;
  color?: string;
  colorHex?: string;
  size?: string;
  price: number;
  stock: number;
  image?: string;
}

export interface IProductSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
}

export interface IProduct extends Document {
  title: string;
  subtitle?: string;
  slug: string;
  description: string;
  sku: string;
  barcode?: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  stock: number;
  lowStockThreshold: number;
  status: 'Active' | 'Draft' | 'Out of Stock' | 'Archived';
  isFeatured: boolean;
  category: string;
  productType: string;
  collectionName?: string;
  themeName?: string;
  gender: 'Men' | 'Women' | 'Unisex';
  colors: string[];
  sizes: string[];
  material?: string;
  fitType?: string;
  images: string[];
  thumbnail?: string;
  variants: IProductVariant[];
  seo?: IProductSEO;
  salesCount: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const variantSchema = new Schema<IProductVariant>({
  id: { type: String, required: true },
  sku: { type: String, required: true },
  color: { type: String, default: '' },
  colorHex: { type: String, default: '' },
  size: { type: String, default: '' },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  image: { type: String, default: '' },
});

const productSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      index: true,
    },
    subtitle: {
      type: String,
      default: '',
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
      required: [true, 'Product description is required'],
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      trim: true,
    },
    barcode: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price must be greater than or equal to 0'],
    },
    compareAtPrice: {
      type: Number,
      default: 0,
    },
    costPrice: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      required: [true, 'Stock count is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
    },
    status: {
      type: String,
      enum: ['Active', 'Draft', 'Out of Stock', 'Archived'],
      default: 'Active',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      required: true,
      default: 'Tops',
    },
    productType: {
      type: String,
      required: true,
      default: 'Shirt',
    },
    collectionName: {
      type: String,
      default: '',
    },
    themeName: {
      type: String,
      default: '',
    },
    gender: {
      type: String,
      enum: ['Men', 'Women', 'Unisex'],
      default: 'Unisex',
    },
    colors: {
      type: [String],
      default: [],
    },
    sizes: {
      type: [String],
      default: [],
    },
    material: {
      type: String,
      default: '',
    },
    fitType: {
      type: String,
      default: '',
    },
    images: {
      type: [String],
      default: [],
    },
    thumbnail: {
      type: String,
      default: '',
    },
    variants: [variantSchema],
    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      keywords: { type: String, default: '' },
    },
    salesCount: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.8,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ title: 'text', description: 'text', sku: 'text' });

export const Product = mongoose.model<IProduct>('Product', productSchema);
