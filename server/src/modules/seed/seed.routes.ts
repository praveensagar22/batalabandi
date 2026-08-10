import { Router } from 'express';
import { SeedController } from './seed.controller';

const router = Router();

router.post('/', SeedController.seedCatalog);

export default router;
