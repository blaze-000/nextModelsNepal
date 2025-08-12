import { Router } from "express";
import * as auditionController from "../controllers/audition.controller";

const router = Router();

router.post("/", auditionController.createAudition);
router.get("/", auditionController.getAllAuditions);
router.get("/season/:seasonId", auditionController.getAuditionsBySeason);
router.get("/:id", auditionController.getAuditionById);
router.put("/:id", auditionController.updateAudition);
router.delete("/:id", auditionController.deleteAudition);

export default router;
