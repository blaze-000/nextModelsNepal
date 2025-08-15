import { z } from "zod";

export const createFeedbackSchema = z.object({
  order: z.number().int().optional(),
  name: z.string().min(1, "Name is required"),
  message: z.string().min(1, "Message is required"),
  // image handled separately inside the controller
});

export const updateFeedbackSchema = createFeedbackSchema.partial();
