import { Router } from 'express';
import { OrderController } from './order.controller';
import { validate } from '../../middleware/validate.middleware';
import { createOrderSchema, updateOrderStatusSchema } from './order.validator';
import { protect, restrictTo } from '../../middleware/auth.middleware';

const router = Router();

router.use(protect);

router.post('/', validate(createOrderSchema), OrderController.createOrder);
router.get('/my-orders', OrderController.getMyOrders);
router.get('/:id', OrderController.getOrder);

// Admin Order Management Routes
router.get('/', restrictTo('admin'), OrderController.getOrders);
router.patch('/:id/status', restrictTo('admin'), validate(updateOrderStatusSchema), OrderController.updateOrderStatus);

export default router;
