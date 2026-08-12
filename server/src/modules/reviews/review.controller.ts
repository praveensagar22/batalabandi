import { Request, Response } from 'express';
import { ReviewService } from './review.service';
import { catchAsync } from '../../utils/catchAsync';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class ReviewController {
  static getProductReviews = catchAsync(async (req: Request, res: Response) => {
    const productId = Array.isArray(req.params.productId) ? req.params.productId[0] : req.params.productId;
    const { reviews, stats, pagination } = await ReviewService.getProductReviews(
      productId,
      req.query
    );
    res.status(200).json({
      status: 'success',
      results: reviews.length,
      stats,
      pagination,
      data: { reviews },
    });
  });

  static createReview = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const productId = Array.isArray(req.params.productId) ? req.params.productId[0] : req.params.productId;
    const userId = req.user?._id?.toString();

    const review = await ReviewService.createReview({
      productId,
      userId,
      ...req.body,
    });

    res.status(201).json({
      status: 'success',
      message: 'Thank you! Your review has been published.',
      data: { review },
    });
  });

  static markHelpful = catchAsync(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const review = await ReviewService.markHelpful(id);
    res.status(200).json({
      status: 'success',
      message: 'Helpful vote registered',
      data: { review },
    });
  });

  static deleteReview = catchAsync(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await ReviewService.deleteReview(id);
    res.status(200).json({
      status: 'success',
      message: 'Review removed successfully',
    });
  });

  static getAllReviews = catchAsync(async (req: Request, res: Response) => {
    const { reviews, pagination } = await ReviewService.getAllReviews(req.query);
    res.status(200).json({
      status: 'success',
      results: reviews.length,
      pagination,
      data: { reviews },
    });
  });
}
