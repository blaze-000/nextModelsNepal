import { Router } from "express";
import { createAudition, getAllAuditions, getAuditionsBySeason, getAuditionById, updateAudition, deleteAudition } from "../controllers/audition.controller";
import { verifyAdminToken } from "../middleware/auth.middleware";

const router = Router();

router.post("/", verifyAdminToken, createAudition);
router.get("/", getAllAuditions);
router.get("/season/:seasonId", getAuditionsBySeason);
router.get("/:id", getAuditionById);
router.put("/:id", verifyAdminToken, updateAudition);
router.delete("/:id", verifyAdminToken, deleteAudition);

export default router;
