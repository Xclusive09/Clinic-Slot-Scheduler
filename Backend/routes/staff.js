import { Router } from 'express';
const router = Router();
import {staffController } from '../controllers/staffController.js';
import { auth } from '../middleware/auth.js';
import { loginValidation, validate } from '../middleware/validate.js';

// Login route
router.post('/login', loginValidation, validate, staffController.login);

// Logout route (handled client-side)
router.post('/logout', auth.authenticate,  staffController.logout);

// Get current staff info
router.get('/me', auth.authenticate, staffController.getCurrentStaff);

export default router;