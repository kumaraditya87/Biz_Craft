// backend/routes/dashboardRoutes.js
import express from "express";
import {
  getUserDashboard,
  updateUserDashboard,
  addToDashboard,
  removeFromDashboard,
} from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All dashboard routes require authentication
router.use(protect);

// Get user's dashboard items
router.get("/", getUserDashboard);

// Update entire dashboard
router.put("/", updateUserDashboard);

// Add item to dashboard
router.post("/add", addToDashboard);

// Remove item from dashboard
router.post("/remove", removeFromDashboard);

export default router;
