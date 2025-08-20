import { Router } from "express";
import { createSocial, deleteSocialById, getAllSocial, getSocialById, updateSocialById } from "../controllers/social.controller";

const router = Router();

router.post("/", createSocial);
router.get("/", getAllSocial);
router.get("/:id", getSocialById);
router.patch("/:id", updateSocialById);
router.delete("/:id", deleteSocialById);

export default router;
