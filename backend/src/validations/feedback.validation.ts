import { z } from "zod";

export const createFeedbackSchema = z.object({
  index: z.number().int().min(1, "Index is required"),
  name: z.string().min(1, "Name is required"),
  message: z.string().min(1, "Message is required"),
  // image handled separately via multer, so no validation here
});

export const updateFeedbackSchema = createFeedbackSchema.partial();
