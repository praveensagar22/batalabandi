import { z } from 'zod';

export const createReviewSchema = z.object({
  body: z.object({
    productId: z.string().min(1, 'Product ID is required'),
    rating: z
      .number()
      .min(1, 'Rating must be between 1 and 5')
      .max(5, 'Rating must be between 1 and 5'),
    userName: z.string().min(2, 'Name must be at least 2 characters'),
    userEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
    title: z.string().optional(),
    comment: z.string().min(5, 'Comment must be at least 5 characters'),
    photos: z.array(z.string()).optional().default([]),
  }),
});
