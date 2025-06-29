import { Router } from 'express';
const router = Router();
import { getSchedule, exportToCSV } from '../controllers/bookingController.js';
import { authenticate } from '../middleware/auth.js';

router.get('/', authenticate, getSchedule);
router.get('/export', authenticate, exportToCSV);

export default router;