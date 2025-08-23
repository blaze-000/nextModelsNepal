import { Router } from "express";
import { getAllPayment, getPaymentStatusById, getPaymentStatusByPrn, payment, returnPayment, mockPayment, debugDV, createFonepayPayment, validatePayment } from "../controllers/payment.controller";
import { paymentLimiter } from "../middleware/rateLimiters";

const router = Router();

// Add global error logging for payment routes
router.use((req, res, next) => {
  console.log(`=== PAYMENT ROUTE: ${req.method} ${req.path} ===`);
  console.log('Query:', req.query);
  console.log('Body:', req.body);
  console.log('Headers:', req.headers);
  next();
});

router.post("/payment", paymentLimiter, payment);
router.get("/payment", getAllPayment);
router.get("/payment/status/:prn", getPaymentStatusByPrn);
router.all("/payment/return", paymentLimiter, returnPayment);
router.get("/payment/mock", mockPayment); // Mock payment endpoint for development
router.get("/payment/debug-dv", debugDV); // Debug DV generation

// Alternative FonePay endpoints based on Spring Boot SDK analysis
router.post("/fonepay/payment", paymentLimiter, createFonepayPayment); // SDK-style payment creation
router.get("/fonepay/validate", validatePayment); // SDK-style payment validation
router.post("/fonepay/validate", validatePayment); // Support both GET and POST for validation

router.get("/payment/:id", getPaymentStatusById);

// Global error handler for payment routes
router.use((err: any, req: any, res: any, next: any) => {
  console.error('=== PAYMENT ROUTE ERROR ===');
  console.error('Error:', err);
  console.error('URL:', req.url);
  console.error('Method:', req.method);
  console.error('========================');
  
  if (res.headersSent) {
    return next(err);
  }
  
  res.status(500).json({
    message: "Payment processing error",
    isSuccess: false,
    error: err.message,
    timestamp: new Date().toISOString()
  });
});

export default router;
