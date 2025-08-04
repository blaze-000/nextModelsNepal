import express from 'express';
import { Request, Response } from 'express';
import path from 'path';

import navRoute from "./routes/nav.route";
import heroRoute from "./routes/hero.route";
import eventRoutes from "./routes/event.route";
import nextEventRoutes from "./routes/next-event.route";
import modelsRoutes from "./routes/companyModels.route";
import careerRoutes from "./routes/career.route";
import feedbackRoutes from "./routes/feedback.route";
import partnersRoutes from "./routes/partners.route";
import newsRoutes from "./routes/news.route";
import contactRoutes from "./routes/contact.route";
import memberRoutes from "./routes/member.route";
import hireRoutes from "./routes/hire.route";
import appRoutes from "./routes/appForm.route"

const app = express();

// Middleware to handle both JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', (req, res, next) => {
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, '..', 'uploads')));

app.use("/api/nav", navRoute);
app.use("/api/hero", heroRoute);
app.use("/api/events", eventRoutes);
app.use("/api/next-events", nextEventRoutes);
app.use("/api/models", modelsRoutes);
app.use("/api/career", careerRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/partners", partnersRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/member", memberRoutes);
app.use("/api/hire-model", hireRoutes);
app.use("/api/app-form", appRoutes);

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