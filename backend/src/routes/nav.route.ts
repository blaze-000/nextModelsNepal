import express from "express";
import {
  getVotingState,
  createVotingState,
  getAllNavInfo
} from "../controllers/nav.controller";

const router = express.Router();

// GET /nav - Get navigation settings
router.get("/", getVotingState);

// POST /nav - Create navigation settings
router.post("/", createVotingState);

// GET /nav/info - Get navigation info
router.get("/info", getAllNavInfo);

export default router;