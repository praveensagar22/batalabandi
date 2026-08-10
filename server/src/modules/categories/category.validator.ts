import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Category name must be at least 2 characters').max(100),
    description: z.string().max(500).optional(),
    image: z.string().url('Invalid image URL').or(z.literal('')).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Category ID is required'),
  }),
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    description: z.string().max(500).optional(),
    image: z.string().url().or(z.literal('')).optional(),
    isActive: z.boolean().optional(),
  }),
});
