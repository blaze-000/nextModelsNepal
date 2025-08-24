import rateLimit from 'express-rate-limit';
import type { Request } from 'express';

// Key generator that works properly with proxies
const getClientIP = (req: Request): string => {
  // When behind proxy, use X-Forwarded-For, otherwise use connection IP
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    // X-Forwarded-For can be comma-separated list, take the first one
    return (Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0]).trim();
  }
  return req.connection.remoteAddress || req.socket.remoteAddress || 'unknown';
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

export const paymentLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // limit each IP to 10 payment-related requests per 10 minutes
  message: {
    success: false,
    message: 'Too many payment requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getClientIP,
});


