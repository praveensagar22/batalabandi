import { Router } from 'express';
import { InventoryController } from './inventory.controller';

const router = Router();

router
  .route('/')
  .get(InventoryController.getInventory)
  .post(InventoryController.createInventoryItem);

router
  .route('/:id/adjust')
  .post(InventoryController.adjustStock);

router
  .route('/:id')
  .delete(InventoryController.deleteInventoryItem);

export default router;
