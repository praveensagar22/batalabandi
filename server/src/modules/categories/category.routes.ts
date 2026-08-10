import { Router } from 'express';
import { CategoryController } from './category.controller';
import { validate } from '../../middleware/validate.middleware';
import { createCategorySchema, updateCategorySchema } from './category.validator';
import { protect, restrictTo } from '../../middleware/auth.middleware';

const router = Router();

router.get('/', CategoryController.getCategories);
router.get('/:id', CategoryController.getCategory);

// Protected Admin Routes
router.use(protect, restrictTo('admin'));
router.post('/', validate(createCategorySchema), CategoryController.createCategory);
router.put('/:id', validate(updateCategorySchema), CategoryController.updateCategory);
router.delete('/:id', CategoryController.deleteCategory);

export default router;
