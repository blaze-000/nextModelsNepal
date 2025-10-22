import { Router } from "express";
import { getDashboardStats } from '../controllers/dashboard.controller.js';
// Removed verifyAdminToken middleware since we want this to be accessible

const router = Router();

// Get dashboard statistics (public access for dashboard display)
router.get("/stats", getDashboardStats);

export default router;