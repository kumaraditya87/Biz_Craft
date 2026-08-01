import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// All admin routes are protected and require admin role
router.use(protect, adminOnly);

// Admin dashboard
router.get('/dashboard', (req, res) => {
  res.json({ 
    message: 'Admin Dashboard',
    user: req.user 
  });
});

// Manage users
router.get('/users', (req, res) => {
  res.json({ message: 'List of users (admin only)' });
});

// Manage tools
router.get('/tools', (req, res) => {
  res.json({ message: 'Manage business tools (admin only)' });
});

// System settings
router.get('/settings', (req, res) => {
  res.json({ message: 'System settings (admin only)' });
});

export default router;