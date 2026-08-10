import { Router } from 'express';
import { ThemeController } from './theme.controller';

const router = Router();

router
  .route('/')
  .get(ThemeController.getThemes)
  .post(ThemeController.createTheme);

router
  .route('/:id')
  .patch(ThemeController.updateTheme)
  .delete(ThemeController.deleteTheme);

export default router;
