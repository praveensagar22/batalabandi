import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    orderItems: z.array(
      z.object({
        product: z.string().min(1, 'Product ID is required'),
        title: z.string().min(1),
        price: z.number().min(0),
        quantity: z.number().min(1),
        image: z.string().optional(),
      })
    ).min(1, 'Order must contain at least one item'),
    shippingAddress: z.object({
      address: z.string().min(1, 'Address is required'),
      city: z.string().min(1, 'City is required'),
      postalCode: z.string().min(1, 'Postal code is required'),
      country: z.string().min(1, 'Country is required'),
    }),
    paymentMethod: z.string().default('COD'),
    totalAmount: z.number().min(0),
  }),
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Order ID is required'),
  }),
  body: z.object({
    orderStatus: z.enum(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']).optional(),
    paymentStatus: z.enum(['Pending', 'Paid', 'Failed']).optional(),
  }),
});
