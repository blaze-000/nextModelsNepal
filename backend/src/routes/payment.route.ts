import { Router } from "express";
import { getAllPayment, getPaymentStatusById, getPaymentStatusByPrn, payment, returnPayment } from "../controllers/payment.controller";
import { paymentLimiter } from "../middleware/rateLimiters";

const router = Router();

router.post("/payment", payment);
router.get("/payment", getAllPayment);
router.get("/payment/status/:prn", getPaymentStatusByPrn);
router.all("/payment/return", paymentLimiter, returnPayment);
router.get("/payment/:id", getPaymentStatusById);

export default router;
