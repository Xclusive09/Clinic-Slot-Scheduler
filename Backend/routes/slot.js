import { Router } from 'express';
import { updateSlotStatus, generateSlots, getAllSlots } from '../controllers/slotController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, getAllSlots);
router.put('/:id', authenticate, updateSlotStatus);
router.post('/generate', authenticate, generateSlots);

export default router;