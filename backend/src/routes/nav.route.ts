import express from "express";
import { 
  showVoting, 
  createShowVoting, 
  updateShowVoting, 
  getAllNavInfo
} from "../controllers/nav.controller";

const router = express.Router();

// GET /nav - Get navigation settings
router.get("/", showVoting);

// POST /nav - Create navigation settings
router.post("/", createShowVoting);

// PATCH /nav - Update navigation settings
router.patch("/", updateShowVoting);

// GET /nav/items - Get navigation items
router.get("/items", getAllNavInfo);

export default router;