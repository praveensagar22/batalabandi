import { Review } from './review.model';
import { Product } from '../products/product.model';
import { AppError } from '../../utils/appError';

export class ReviewService {
  /**
   * Get all reviews for a product with rating statistics and filter/sort options
   */
  static async getProductReviews(productId: string, query: Record<string, any>) {
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = { productId, status: 'approved' };

    // Optional filtering
    if (query.hasPhotos === 'true') {
      filter['photos.0'] = { $exists: true };
    }
    if (query.rating) {
      filter.rating = parseInt(query.rating as string);
    }

    // Optional sorting
    let sort: Record<string, any> = { createdAt: -1 }; // Default newest
    if (query.sortBy === 'rating_high') {
      sort = { rating: -1, createdAt: -1 };
    } else if (query.sortBy === 'rating_low') {
      sort = { rating: 1, createdAt: -1 };
    } else if (query.sortBy === 'helpful') {
      sort = { helpfulCount: -1, createdAt: -1 };
    }

    const reviews = await Review.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const totalReviews = await Review.countDocuments(filter);

    // Compute Overall Statistics for this Product (all approved reviews)
    const allApproved = await Review.find({ productId, status: 'approved' }).lean();
    const totalAllCount = allApproved.length;

    let averageRating = 5.0;
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const allPhotos: string[] = [];

    if (totalAllCount > 0) {
      let sumRating = 0;
      allApproved.forEach((r) => {
        sumRating += r.rating;
        const rInt = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
        ratingCounts[rInt] = (ratingCounts[rInt] || 0) + 1;

        if (r.photos && r.photos.length > 0) {
          allPhotos.push(...r.photos);
        }
      });
      averageRating = Number((sumRating / totalAllCount).toFixed(1));
    }

    return {
      reviews,
      stats: {
        totalReviews: totalAllCount,
        averageRating,
        ratingCounts,
        allPhotos,
      },
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalReviews / limit) || 1,
        totalItems: totalReviews,
      },
    };
  }

  /**
   * Create a new product review and update parent product rating
   */
  static async createReview(data: {
    productId: string;
    userId?: string;
    userName: string;
    userEmail?: string;
    rating: number;
    title?: string;
    comment: string;
    photos?: string[];
  }) {
    // Verify product exists by id or slug
    let product = await Product.findById(data.productId);
    if (!product) {
      product = await Product.findOne({ slug: data.productId });
    }

    if (!product) {
      throw new AppError('Product not found to add review', 404);
    }

    const newReview = await Review.create({
      productId: product._id,
      userId: data.userId,
      userName: data.userName,
      userEmail: data.userEmail || '',
      rating: data.rating,
      title: data.title || '',
      comment: data.comment,
      photos: data.photos || [],
      verifiedPurchase: true, // Default verified purchase flag
      status: 'approved',
    });

    // Recalculate Product Average Rating
    await this.updateProductRating(product._id.toString());

    return newReview;
  }

  /**
   * Increment helpful vote count
   */
  static async markHelpful(reviewId: string) {
    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    );
    if (!review) {
      throw new AppError('Review not found', 404);
    }
    return review;
  }

  /**
   * Delete a review
   */
  static async deleteReview(reviewId: string) {
    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) {
      throw new AppError('Review not found', 404);
    }
    await this.updateProductRating(review.productId.toString());
    return true;
  }

  /**
   * Recalculate average rating for a product
   */
  private static async updateProductRating(productId: string) {
    const reviews = await Review.find({ productId, status: 'approved' });
    if (reviews.length === 0) return;

    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    const avg = Number((sum / reviews.length).toFixed(1));

    await Product.findByIdAndUpdate(productId, { rating: avg });
  }

  /**
   * Get all reviews across all products for Admin management
   */
  static async getAllReviews(query: Record<string, any>) {
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};
    if (query.status && query.status !== 'all') {
      filter.status = query.status;
    }
    if (query.rating) {
      filter.rating = parseInt(query.rating as string);
    }

    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Review.countDocuments(filter);

    return {
      reviews,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
        totalItems: total,
      },
    };
  }
}
