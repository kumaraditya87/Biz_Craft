// backend/routes/userRoutes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getUserProfile, 
  updateUserProfile, 
  getUserStats,
  changePassword,
  getDashboardItems,
  updateDashboardItems
} from '../controllers/userController.js';

const router = express.Router();

// All routes below this will be protected
router.use(protect);

// User profile routes
router.route('/profile')
  .get(getUserProfile)
  .put(updateUserProfile);

// User stats route
router.get('/stats', getUserStats);

// Change password route
router.post('/change-password', changePassword);

// User dashboard routes
router.route('/dashboard')
  .get(getDashboardItems)
  .put(updateDashboardItems);

export default router;