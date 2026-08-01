import express from 'express';
import { 
  registerUser, 
  loginUser, 
  verifyToken,
  getUserProfile 
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/verify', protect, verifyToken);
router.get('/profile', protect, getUserProfile);

export default router;