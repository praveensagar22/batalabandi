import mongoose, { Document, Schema } from 'mongoose';

export interface IProductTypeDefaults {
  sizeChartTemplate?: string;
  fabricMaterial?: string;
  taxClass?: string;
  shippingClass?: string;
}

export interface IProductType extends Document {
  name: string;
  slug: string;
  description?: string;
  parentCategory: string;
  genderAvailability: string[];
  productsCount: number;
  featured: boolean;
  status: 'Active' | 'Inactive';
  sortOrder: number;
  icon?: string;
  image?: string;
  defaults: IProductTypeDefaults;
  createdAt: Date;
  updatedAt: Date;
}

const productTypeSchema = new Schema<IProductType>(
  {
    name: {
      type: String,
      required: [true, 'Product Type name is required'],
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
    description: {
      type: String,
      default: '',
    },
    parentCategory: {
      type: String,
      required: true,
      default: 'Tops',
    },
    genderAvailability: {
      type: [String],
      default: ['Men', 'Women', 'Unisex'],
    },
    productsCount: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
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
    icon: {
      type: String,
      default: 'Shirt',
    },
    image: {
      type: String,
      default: '',
    },
    defaults: {
      sizeChartTemplate: { type: String, default: 'Standard Topwear (S-XXL)' },
      fabricMaterial: { type: String, default: '100% Cotton (220 GSM)' },
      taxClass: { type: String, default: 'Apparel 5% GST' },
      shippingClass: { type: String, default: 'Standard Parcel' },
    },
  },
  {
    timestamps: true,
  }
);

export const ProductType = mongoose.model<IProductType>('ProductType', productTypeSchema);
