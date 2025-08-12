import { z } from "zod";

export const createEventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  overview: z.string().min(1, "Overview is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  quote: z.string().min(1, "Quote is required"),
  purpose: z.string().min(1, "Purpose is required"),
  timelineSubtitle: z.string().min(1, "Timeline subtitle is required"),
  managedBy: z.enum(["self", "partner"]),
  // image validations will be handled separately inside controller
});

export const updateEventSchema = createEventSchema.partial();
