import { z } from "zod";

export const createSeasonSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
  year: z.number().min(1900, "Year must be at least 1900"),
  status: z.enum(["upcoming", "ongoing", "ended"]).default("upcoming"),
  startDate: z.coerce.date().optional(),
  auditionFormDeadline: z.coerce.date().optional(),
  votingOpened: z.boolean().optional(),
  votingEndDate: z.coerce.date().optional(),
  endDate: z.coerce.date(),
  slug: z.string().min(1, "Slug is required"),
  pricePerVote: z.number().positive().optional(),
  gallery: z.array(z.string()).optional(),
  notice: z.array(z.string()).optional(),
  timeline: z.array(z.object({
    label: z.string().min(1, "Label is required"),
    datespan: z.string().min(1, "Datespan is required"),
    icon: z.string().min(1, "Icon is required")
  })).optional(),
});

export const updateSeasonSchema = createSeasonSchema.partial().extend({
  eventId: z.string().min(1, "Event ID is required").optional()
});