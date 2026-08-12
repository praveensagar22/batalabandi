import { Router } from 'express';
import { ReviewController } from './review.controller';
import { validate } from '../../middleware/validate.middleware';
import { createReviewSchema } from './review.validator';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

// GET /api/v1/reviews - Get all reviews across products (for Admin dashboard)
router.get('/', protect, ReviewController.getAllReviews);

// GET /api/v1/reviews/product/:productId - Get reviews for a product
router.get('/product/:productId', ReviewController.getProductReviews);

// POST /api/v1/reviews/product/:productId - Create a review
router.post(
  '/product/:productId',
  (req, res, next) => {
    // Inject productId into req.body for validation
    req.body.productId = req.params.productId;
    next();
  },
  validate(createReviewSchema),
  ReviewController.createReview
);

// POST /api/v1/reviews/:id/helpful - Vote review as helpful
router.post('/:id/helpful', ReviewController.markHelpful);

// DELETE /api/v1/reviews/:id - Delete review
router.delete('/:id', protect, ReviewController.deleteReview);

export default router;
