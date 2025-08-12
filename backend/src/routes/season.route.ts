import { Router } from "express";
import * as seasonController from "../controllers/season.controller";

const router = Router();

// Create season under an event
router.post("/", seasonController.createSeason);
router.get("/event/:eventId", seasonController.getSeasonsByEvent);
router.get("/:id", seasonController.getSeasonById);
router.put("/:id", seasonController.updateSeason);
router.delete("/:id", seasonController.deleteSeason);

export default router;
