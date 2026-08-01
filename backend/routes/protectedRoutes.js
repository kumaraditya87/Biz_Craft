import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes in this file are protected
router.use(protect);

// Dashboard route
router.get('/dashboard', (req, res) => {
  res.json({ 
    message: 'Welcome to dashboard',
    user: req.user 
  });
});

// Business tools route
router.get('/business-tools', (req, res) => {
  res.json({ 
    message: 'Business tools data',
    user: req.user 
  });
});

// Suppliers route
router.get('/suppliers', (req, res) => {
  res.json({ 
    message: 'Suppliers directory data',
    user: req.user 
  });
});

// Business guide route
router.get('/business-guide', (req, res) => {
  res.json({ 
    message: 'Business guide content',
    user: req.user 
  });
});

export default router;