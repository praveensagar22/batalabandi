import { Router } from 'express';
import { ProductTypeController } from './product-type.controller';

const router = Router();

router
  .route('/')
  .get(ProductTypeController.getProductTypes)
  .post(ProductTypeController.createProductType);

router
  .route('/:id')
  .patch(ProductTypeController.updateProductType)
  .delete(ProductTypeController.deleteProductType);

export default router;
