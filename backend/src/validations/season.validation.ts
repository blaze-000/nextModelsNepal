import { z } from "zod";

export const createSeasonSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
  year: z.number().min(1900, "Year must be at least 1900"),
  image: z.string().url("Image must be a valid URL"),
  status: z.enum(["upcoming", "ongoing", "ended"]).default("upcoming"),
  startDate: z.coerce.date().optional(),
  auditionFormDeadline: z.coerce.date().optional(),
  votingOpened: z.boolean().optional(),
  votingEndDate: z.coerce.date().optional(),
  endDate: z.coerce.date(),
  slug: z.string().min(1, "Slug is required"),
  pricePerVote: z.number().optional(),
  titleImage: z.string().url("Title image must be a valid URL").optional(),
  posterImage: z.string().url("Poster image must be a valid URL").optional(),
  gallery: z.array(z.string().url()).optional(),
  notice: z.array(z.string()).optional(),
  timeline: z.array(z.object({
    label: z.string(),
    datespan: z.string(),
    icon: z.string()
  })).optional(),
});

export const updateSeasonSchema = createSeasonSchema.partial().omit({ eventId: true });
