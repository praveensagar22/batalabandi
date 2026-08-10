import mongoose, { Document, Schema } from 'mongoose';

export interface IInventoryLog {
  id: string;
  changeAmount: number;
  previousStock: number;
  newStock: number;
  reason: 'Restock' | 'Sale' | 'Damaged' | 'Return' | 'Audit Correction' | 'Initial Stock';
  note?: string;
  user: string;
  timestamp: Date;
}

export interface IInventoryItem extends Document {
  sku: string;
  productId?: mongoose.Types.ObjectId;
  productTitle: string;
  productImage?: string;
  category: string;
  color?: string;
  size?: string;
  location: string;
  availableStock: number;
  reservedStock: number;
  lowStockThreshold: number;
  unitCost: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  logs: IInventoryLog[];
  createdAt: Date;
  updatedAt: Date;
}

const inventoryLogSchema = new Schema<IInventoryLog>({
  id: { type: String, required: true },
  changeAmount: { type: Number, required: true },
  previousStock: { type: Number, required: true },
  newStock: { type: Number, required: true },
  reason: {
    type: String,
    enum: ['Restock', 'Sale', 'Damaged', 'Return', 'Audit Correction', 'Initial Stock'],
    required: true,
  },
  note: { type: String, default: '' },
  user: { type: String, default: 'Admin' },
  timestamp: { type: Date, default: Date.now },
});

const inventorySchema = new Schema<IInventoryItem>(
  {
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      trim: true,
      index: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    productTitle: {
      type: String,
      required: true,
      trim: true,
    },
    productImage: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'Tops',
    },
    color: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: 'Main Warehouse (WH-01)',
    },
    availableStock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Available stock cannot be negative'],
    },
    reservedStock: {
      type: Number,
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
    },
    unitCost: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['In Stock', 'Low Stock', 'Out of Stock'],
      default: 'In Stock',
    },
    logs: [inventoryLogSchema],
  },
  {
    timestamps: true,
  }
);

inventorySchema.index({ sku: 'text', productTitle: 'text' });

export const InventoryModel = mongoose.model<IInventoryItem>('Inventory', inventorySchema);
