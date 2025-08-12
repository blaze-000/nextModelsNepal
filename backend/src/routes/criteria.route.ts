import { Router } from "express";
import * as criteriaController from "../controllers/criteria.controller";

const router = Router();

router.post("/", criteriaController.createCriteria);
router.get("/season/:seasonId", criteriaController.getCriteriaBySeason);
router.get("/:id", criteriaController.getCriteriaById);
router.put("/:id", criteriaController.updateCriteria);
router.delete("/:id", criteriaController.deleteCriteria);

export default router;
