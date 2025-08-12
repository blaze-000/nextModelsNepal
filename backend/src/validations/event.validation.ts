import { z } from "zod";

export const createEventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  overview: z.string().min(1, "Overview is required"),
  titleImage: z.string().url("Title image must be a valid URL"),
  coverImage: z.string().url("Cover image must be a valid URL"),
  subtitle: z.string().min(1, "Subtitle is required"),
  quote: z.string().min(1, "Quote is required"),
  purpose: z.string().min(1, "Purpose is required"),
  purposeImage: z.string().url("Purpose image must be a valid URL"),
  timelineSubtitle: z.string().min(1, "Timeline subtitle is required"),
  managedBy: z.enum(["self", "partner"]),
});

export const updateEventSchema = createEventSchema.partial();
