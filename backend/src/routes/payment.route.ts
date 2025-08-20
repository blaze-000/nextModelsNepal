import { Router } from "express";
import { getAllPayment, getPaymentStatusById, getPaymentStatusByPrn, payment, returnPayment } from "../controllers/payment.controller";

const router = Router();

router.post("/payment", payment);
router.get("/payment", getAllPayment);
router.get("/payment/status/:prn", getPaymentStatusByPrn);
router.get("/payment/:id", getPaymentStatusById);
router.all("/payment/return", returnPayment);

export default router;
