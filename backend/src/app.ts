import express from 'express';
import { Request, Response, NextFunction } from 'express';
import path from 'path';
import multer from 'multer';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';

import './config/eventStatusUpdater';

// Environment configuration
const NODE_ENV = process.env.NODE_ENV || 'development';
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);

import navRoute from "./routes/nav.route";
import heroRoute from "./routes/hero.route";

import modelsRoutes from "./routes/companyModels.route";
import careerRoutes from "./routes/career.route";
import feedbackRoutes from "./routes/feedback.route";
import partnersRoutes from "./routes/partners.route";
import newsRoutes from "./routes/news.route";
import contactRoutes from "./routes/contact.route";
import hireRoutes from "./routes/hire.route";
import appRoutes from "./routes/appForm.route"
import authRoutes from "./routes/auth.route"
import eventRoutes from "./routes/event.route"
import seasonRoutes from "./routes/season.route";
import winnerRoutes from "./routes/winner.route";
import juryRoutes from "./routes/jury.route";
import sponsorsRoutes from "./routes/sponsor.route";
import auditionsRoutes from "./routes/audition.route";
import contestantRoutes from "./routes/contestant.route";
import criteriaRoutes from "./routes/criteria.route";
const app = express();

// Trust proxy if behind load balancer / reverse proxy (only in production)
if (NODE_ENV === 'production') {
  app.set('trust proxy', true);
}

// Security headers
app.use(helmet());

// CORS: allow only configured origins (or all in development if none provided)
const allowlist = new Set(ALLOWED_ORIGINS);
type SimpleCorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => void;
  credentials?: boolean;
};
const corsOptions: SimpleCorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) return callback(null, true); // allow non-browser clients
    if (allowlist.size === 0 && NODE_ENV !== 'production') return callback(null, true);
    if (allowlist.has(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};
app.use(cors(corsOptions));

// Compression
app.use(compression());

// Logging
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

// Middleware to handle both JSON and form data
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// // Rate limiting (general)
// const generalLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   standardHeaders: true,
//   legacyHeaders: false,
// });
// app.use(generalLimiter);

app.use('/uploads', (req, res, next) => {
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, '..', 'uploads'), { maxAge: NODE_ENV === 'production' ? '7d' : 0 }));

app.use("/api/nav", navRoute);
app.use("/api/hero", heroRoute);
app.use("/api/events", eventRoutes);
app.use("/api/season", seasonRoutes);
app.use("/api/sponsors", sponsorsRoutes);
app.use("/api/criteria", criteriaRoutes);
app.use("/api/auditions", auditionsRoutes);
app.use("/api/winners", winnerRoutes);
app.use("/api/jury", juryRoutes);
app.use("/api/contestants", contestantRoutes);
app.use("/api/models", modelsRoutes);
app.use("/api/career", careerRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/partners", partnersRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/hire-model", hireRoutes);
app.use("/api/app-form", appRoutes);
app.use("/api/auth", authRoutes);

// Global error handler for Multer errors
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof multer.MulterError) {
    console.error('Multer error:', error);
    return res.status(400).json({
      success: false,
      message: 'File upload error',
      error: error.message,
      code: error.code,
      field: error.field
    });
  }
  
  // Handle other file-related errors
  if (error.message && error.message.includes('Only image files are allowed')) {
    console.error('File type error:', error.message);
    return res.status(400).json({
      success: false,
      message: 'Invalid file type',
      error: error.message
    });
  }
  
  next(error);
});

// 404 handler
app.use((req: Request, res: Response) => {
  return res.status(404).json({ success: false, message: 'Not Found' });
});

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (NODE_ENV !== 'production') {
    console.error(err);
  }
  const status = typeof err?.status === 'number' ? err.status : 500;
  return res.status(status).json({ success: false, message: 'Internal Server Error' });
});

// Health check endpoint
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Next Models Nepal API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

export default app;