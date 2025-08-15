import { z } from "zod";

export const createSeasonSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
  year: z
    .string()
    .min(4, "Year must be at least 4 digits")
    .max(4, "Year must be 4 digits"),
  status: z.enum(["upcoming", "ongoing", "ended"]).default("upcoming"),
  startDate: z.coerce.date().optional(),
  auditionFormDeadline: z.coerce.date().optional(),
  votingOpened: z.string().optional(),
  votingEndDate: z.coerce.date().optional(),
  endDate: z.coerce.date(),
  slug: z.string().min(1, "Slug is required"),
  pricePerVote: z.string().min(1, "Price per vote is required").optional(),
  notice: z.array(z.string()).optional(),
  timeline: z
    .array(
      z.object({
        label: z.string().optional(),
        datespan: z.string().optional(),
        icon: z.string().optional(),
      })
    )
    .optional(),
});

export const updateSeasonSchema = createSeasonSchema.partial().extend({
  eventId: z.string().min(1, "Event ID is required").optional(),
});
