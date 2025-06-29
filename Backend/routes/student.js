import { Router } from 'express';
import { paymentWebhook } from '../controllers/studentController.js';
import { getStudentSlot } from '../controllers/studentController.js';
const router = Router();

router.get('/student-slot', getStudentSlot);
router.post('/payment-webhook', paymentWebhook);
export default router;