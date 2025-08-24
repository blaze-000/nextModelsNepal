import rateLimit from 'express-rate-limit';
import type { Request } from 'express';

// Enhanced key generator that works properly with proxies and various IP headers
const getClientIP = (req: Request): string => {
  // Enhanced IP extraction with multiple fallback methods
  let ipAddress = 'unknown';
  
  // Use express's built-in IP resolution when trust proxy is set
  if (req.ip && req.ip !== '::1' && req.ip !== '127.0.0.1') {
    ipAddress = req.ip;
  } 
  // Handle x-forwarded-for header (can be comma-separated list)
  else if (req.headers['x-forwarded-for']) {
    const forwardedFor = req.headers['x-forwarded-for'];
    if (Array.isArray(forwardedFor)) {
      // Take the first IP in the array that's not localhost
      ipAddress = forwardedFor.find(ip => ip !== '::1' && ip !== '127.0.0.1') || forwardedFor[0];
    } else {
      // Split by comma and take the first IP that's not localhost
      const ips = forwardedFor.split(',').map(ip => ip.trim());
      ipAddress = ips.find(ip => ip !== '::1' && ip !== '127.0.0.1') || ips[0];
    }
  }
  // Handle other common headers
  else if (req.headers['x-real-ip']) {
    ipAddress = req.headers['x-real-ip'] as string;
  }
  else if (req.headers['cf-connecting-ip']) {
    ipAddress = req.headers['cf-connecting-ip'] as string;
  }
  else if (req.headers['x-client-ip']) {
    ipAddress = req.headers['x-client-ip'] as string;
  }
  // Fallback to connection remote address
  else if (req.connection?.remoteAddress) {
    ipAddress = req.connection.remoteAddress;
  }
  else if (req.socket?.remoteAddress) {
    ipAddress = req.socket.remoteAddress;
  }
  
  // Normalize IPv6 localhost to IPv4
  if (ipAddress === '::1') {
    ipAddress = '127.0.0.1';
  }
  
  // Remove IPv6 prefix if present
  if (ipAddress && ipAddress.startsWith('::ffff:')) {
    ipAddress = ipAddress.substring(7);
  }
  
  // Handle case where IP might be undefined or empty
  if (!ipAddress || ipAddress === 'unknown') {
    ipAddress = '127.0.0.1'; // Default to localhost if no IP found
  }
  
  return ipAddress;
};

export const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 50, // 50 requests per 10 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getClientIP,
});

export const hireLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getClientIP,
});

export const appFormLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getClientIP,
});

// Middleware to bypass rate limiting for successful payments
export const paymentRateLimitBypass = async (req: any, res: any, next: any) => {
  // For return payment endpoint, check if this is a successful payment
  if (req.path === '/api/fonepay/payment/return') {
    const { PRN } = req.query || req.body || {};
    if (PRN) {
      let prnToSearch = String(PRN);
      if (!prnToSearch.startsWith("prn_")) {
        prnToSearch = `prn_${prnToSearch}`;
      }
      
      // Import Payment model inline to avoid circular dependencies
      const { Payment } = await import('../models/payment.model');
      
      try {
        const payment = await Payment.findOne({ prn: prnToSearch });
        // If payment is already successful, bypass rate limiting
        if (payment && payment.status === 'success' && payment.apiVerificationStatus === 'success') {
          return next();
        }
      } catch (error) {
        console.error('Error checking payment status for rate limit bypass:', error);
      }
    }
  }
  
  // For status endpoints, bypass rate limiting for successful payments
  if (req.path.startsWith('/api/fonepay/payment/status/')) {
    const prn = req.params.prn;
    if (prn) {
      let prnToSearch = prn;
      if (!prnToSearch.startsWith("prn_")) {
        prnToSearch = `prn_${prnToSearch}`;
      }
      
      // Import Payment model inline to avoid circular dependencies
      const { Payment } = await import('../models/payment.model');
      
      try {
        const payment = await Payment.findOne({ prn: prnToSearch });
        // If payment is already successful, bypass rate limiting
        if (payment && payment.status === 'success') {
          return next();
        }
      } catch (error) {
        console.error('Error checking payment status for rate limit bypass:', error);
      }
    }
  }
  
  // Continue with normal rate limiting
  next();
};

export const paymentLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 payment-related requests per 10 minutes
  message: {
    success: false,
    message: 'Too many payment requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getClientIP,
});