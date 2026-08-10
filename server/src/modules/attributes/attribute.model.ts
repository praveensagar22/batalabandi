import mongoose, { Document, Schema } from 'mongoose';

export interface IAttributeValue {
  id: string;
  name: string;
  slug: string;
  displayLabel: string;
  colorHex?: string;
  image?: string;
  sortOrder: number;
  productsCount: number;
  status: 'Active' | 'Inactive';
}

export interface IAttribute extends Document {
  name: string;
  slug: string;
  description?: string;
  type: 'Text' | 'Color Picker' | 'Image Swatch' | 'Number' | 'Icon' | 'Multi Select';
  enableFilter: boolean;
  visibleOnProductPage: boolean;
  required: boolean;
  sortingMode: 'Alphabetical' | 'Custom' | 'Manual';
  status: 'Active' | 'Inactive';
  icon?: string;
  values: IAttributeValue[];
  createdAt: Date;
  updatedAt: Date;
}

const attributeValueSchema = new Schema<IAttributeValue>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  displayLabel: { type: String, required: true },
  colorHex: { type: String, default: '' },
  image: { type: String, default: '' },
  sortOrder: { type: Number, default: 1 },
  productsCount: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
});

const attributeSchema = new Schema<IAttribute>(
  {
    name: {
      type: String,
      required: [true, 'Attribute name is required'],
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
    type: {
      type: String,
      enum: ['Text', 'Color Picker', 'Image Swatch', 'Number', 'Icon', 'Multi Select'],
      default: 'Text',
    },
    enableFilter: {
      type: Boolean,
      default: true,
    },
    visibleOnProductPage: {
      type: Boolean,
      default: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
    sortingMode: {
      type: String,
      enum: ['Alphabetical', 'Custom', 'Manual'],
      default: 'Manual',
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    icon: {
      type: String,
      default: 'Tag',
    },
    values: [attributeValueSchema],
  },
  {
    timestamps: true,
  }
);

export const AttributeModel = mongoose.model<IAttribute>('Attribute', attributeSchema);
