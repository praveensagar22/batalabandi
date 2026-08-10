import { Router } from 'express';
import { CollectionController } from './collection.controller';

const router = Router();

router
  .route('/')
  .get(CollectionController.getCollections)
  .post(CollectionController.createCollection);

router
  .route('/:id')
  .patch(CollectionController.updateCollection)
  .delete(CollectionController.deleteCollection);

export default router;
