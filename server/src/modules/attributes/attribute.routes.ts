import { Router } from 'express';
import { AttributeController } from './attribute.controller';

const router = Router();

router
  .route('/')
  .get(AttributeController.getAttributes)
  .post(AttributeController.createAttribute);

router
  .route('/:id')
  .patch(AttributeController.updateAttribute)
  .delete(AttributeController.deleteAttribute);

export default router;
