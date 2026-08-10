import { Router } from 'express';
import { CartController } from './cart.controller';

const router = Router();

router.get('/', CartController.getCart);
router.post('/items', CartController.addItem);
router.patch('/items/:itemId', CartController.updateQuantity);
router.delete('/items/:itemId', CartController.removeItem);
router.delete('/', CartController.clearCart);
router.post('/calculate', CartController.calculateCart);

export default router;
