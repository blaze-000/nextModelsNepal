import { Router } from "express";
import { getAllPayment, getPaymentStatusById, getPaymentStatusByPrn, payment, returnPayment, getPaymentStats, deletePayment, deleteAllPayments } from '../controllers/payment.controller.js';
import { paymentLimiter, paymentRateLimitBypass } from '../middleware/rateLimiters.js';

const router = Router();

router.post("/payment", paymentLimiter, payment);
router.get("/payment", getAllPayment);
router.get("/payment/stats", getPaymentStats);
router.get("/payment/status/:prn", paymentRateLimitBypass, getPaymentStatusByPrn);
router.all("/payment/return", paymentRateLimitBypass, returnPayment);
router.get("/payment/:id", paymentRateLimitBypass, getPaymentStatusById);
router.delete("/payment/:id", deletePayment);
router.delete("/payment", deleteAllPayments);

export default router;