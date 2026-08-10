import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
  _id?: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId | string;
  quantity: number;
  color?: string;
  size?: string;
  price: number;
  title: string;
  subtitle?: string;
  image: string;
}

export interface ICart extends Document {
  sessionId: string;
  userId?: mongoose.Types.ObjectId;
  items: ICartItem[];
  couponCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>({
  productId: { type: Schema.Types.Mixed, required: true },
  quantity: { type: Number, required: true, default: 1, min: 1 },
  color: { type: String, default: 'Standard' },
  size: { type: String, default: 'M' },
  price: { type: Number, required: true },
  title: { type: String, required: true },
  subtitle: { type: String },
  image: { type: String, required: true },
});

const CartSchema = new Schema<ICart>(
  {
    sessionId: { type: String, required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    items: [CartItemSchema],
    couponCode: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Cart = mongoose.model<ICart>('Cart', CartSchema);
