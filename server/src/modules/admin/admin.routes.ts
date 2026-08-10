import { Router } from 'express';
import { AdminController } from './admin.controller';
import { protect, restrictTo } from '../../middleware/auth.middleware';

const router = Router();

router.use(protect, restrictTo('admin'));

router.get('/stats', AdminController.getStats);
router.get('/users', AdminController.getUsers);
router.patch('/users/:id/role', AdminController.updateUserRole);

export default router;
