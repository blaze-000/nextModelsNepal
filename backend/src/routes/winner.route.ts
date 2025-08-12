import { Router } from "express";
import * as winnerController from "../controllers/winner.controller";

const router = Router();

router.post("/", winnerController.createWinner);
router.get("/season/:seasonId", winnerController.getWinnersBySeason);
router.get("/:id", winnerController.getWinnerById);
router.put("/:id", winnerController.updateWinner);
router.delete("/:id", winnerController.deleteWinner);

export default router;
