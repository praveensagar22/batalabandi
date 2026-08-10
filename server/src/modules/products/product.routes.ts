import { Router } from 'express';
import { ProductController } from './product.controller';
import { validate } from '../../middleware/validate.middleware';
import { createProductSchema, updateProductSchema } from './product.validator';
import { protect, restrictTo } from '../../middleware/auth.middleware';

const router = Router();

router.get('/', ProductController.getProducts);
router.get('/:id', ProductController.getProduct);

// Protected Admin Routes
router.use(protect, restrictTo('admin'));
router.post('/', validate(createProductSchema), ProductController.createProduct);
router.put('/:id', validate(updateProductSchema), ProductController.updateProduct);
router.delete('/:id', ProductController.deleteProduct);

export default router;
