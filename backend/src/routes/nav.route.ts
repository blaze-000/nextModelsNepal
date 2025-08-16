import express from "express";
import {
  getVotingState,
  createVotingState,
  getAllNavInfo
} from "../controllers/nav.controller";
import { verifyAdminToken } from "../middleware/auth.middleware";

const router = express.Router();

// GET /nav - Get navigation settings
router.get("/", getVotingState);

// POST /nav - Create navigation settings
router.post("/", verifyAdminToken, createVotingState);

// GET /nav/info - Get navigation info
router.get("/info", getAllNavInfo);

export default router;