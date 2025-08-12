import { Router } from "express";
import * as sponsorController from "../controllers/sponsor.controller";

const router = Router();

router.post("/", sponsorController.createSponsor);
router.get("/season/:seasonId", sponsorController.getSponsorsBySeason);
router.get("/:id", sponsorController.getSponsorById);
router.put("/:id", sponsorController.updateSponsor);
router.delete("/:id", sponsorController.deleteSponsor);

export default router;
