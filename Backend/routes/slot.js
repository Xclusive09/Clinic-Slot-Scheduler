import { Router } from 'express';
import { updateSlotStatus, generateSlots } from '../controllers/slotController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.put('/:id', authenticate, updateSlotStatus);
router.post('/generate', authenticate, generateSlots);

export default router;