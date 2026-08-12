import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  productId: mongoose.Types.ObjectId | string;
  userId?: mongoose.Types.ObjectId | string;
  userName: string;
  userEmail?: string;
  rating: number;
  title?: string;
  comment: string;
  photos: string[];
  verifiedPurchase: boolean;
  helpfulCount: number;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    productId: {
      type: Schema.Types.Mixed,
      required: [true, 'Product ID is required'],
      index: true,
    },
    userId: {
      type: Schema.Types.Mixed,
      index: true,
    },
    userName: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
    },
    userEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    title: {
      type: String,
      trim: true,
      default: '',
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
    },
    photos: {
      type: [String],
      default: [],
    },
    verifiedPurchase: {
      type: Boolean,
      default: true,
    },
    helpfulCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['approved', 'pending', 'rejected'],
      default: 'approved',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for querying reviews per product sorted by date
reviewSchema.index({ productId: 1, createdAt: -1 });

export const Review = mongoose.model<IReview>('Review', reviewSchema);
