import { Router } from "express";
import { createAudition, getAllAuditions, getAuditionsBySeason, getAuditionById, updateAudition, deleteAudition } from "../controllers/audition.controller";

const router = Router();

router.post("/", createAudition);
router.get("/", getAllAuditions);
router.get("/season/:seasonId", getAuditionsBySeason);
router.get("/:id", getAuditionById);
router.put("/:id", updateAudition);
router.delete("/:id", deleteAudition);

export default router;
