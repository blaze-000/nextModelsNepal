import { Router } from "express";
import * as contestantController from "../controllers/contestant.controller";

const router = Router();

router.post("/", contestantController.createContestant);
router.get("/season/:seasonId", contestantController.getContestantsBySeason);
router.get("/:id", contestantController.getContestantById);
router.put("/:id", contestantController.updateContestant);
router.delete("/:id", contestantController.deleteContestant);

export default router;
