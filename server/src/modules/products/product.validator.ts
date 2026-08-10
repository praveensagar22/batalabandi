import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Title must be at least 2 characters').max(200),
    description: z.string().min(5, 'Description must be at least 5 characters'),
    price: z.number().min(0, 'Price cannot be negative'),
    discountPrice: z.number().min(0).optional(),
    stock: z.number().min(0).default(0),
    images: z.array(z.string()).optional(),
    category: z.string().min(1, 'Category ID is required'),
    isFeatured: z.boolean().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Product ID is required'),
  }),
  body: z.object({
    title: z.string().min(2).max(200).optional(),
    description: z.string().min(5).optional(),
    price: z.number().min(0).optional(),
    discountPrice: z.number().min(0).optional(),
    stock: z.number().min(0).optional(),
    images: z.array(z.string()).optional(),
    category: z.string().optional(),
    isFeatured: z.boolean().optional(),
    isActive: z.boolean().optional(),
  }),
});
