import { Router } from 'express';
import { PaymentController } from './payment.controller';

const router = Router();

router.post('/create-order', PaymentController.createRazorpayOrder);
router.post('/verify', PaymentController.verifyPayment);
router.post('/webhook', PaymentController.handleWebhook);

export default router;
