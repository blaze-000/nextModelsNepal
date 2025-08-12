import { Router } from "express";
import * as juryController from "../controllers/jury.controller";

const router = Router();

router.post("/", juryController.createJury);
router.get("/season/:seasonId", juryController.getJuryBySeason);
router.get("/:id", juryController.getJuryById);
router.put("/:id", juryController.updateJury);
router.delete("/:id", juryController.deleteJury);

export default router;
