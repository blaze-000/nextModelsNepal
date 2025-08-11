import { z } from "zod";

export const eventZodSchema = z.object({
  state: z.string().optional(),

  title: z.string().min(1, { message: "Title is required" }),
  slug: z.string(),
  manageBy: z.enum(["partners", "self"]).default("self"),
  date: z.string().min(1, { message: "Date is required" }),
  year: z.string().optional().transform((val) => {
        if (!val || val.trim() === "") return "2025";
        return val;
  }),

  coverImage: z.string().min(1, { message: "Cover image is required" }),
  titleImage: z.string().optional(),
  logo: z.string().min(1, { message: "Logo is required" }),
  subImage: z.string().optional(),

  overview: z.string().min(1, { message: "Overview is required" }),
  purpose: z.string().optional(),
  highlight: z.array(z.string()).default([]),

  eventDescription: z.string().optional(),

  startingTimelineIcon: z.string().min(1),
  startingTimelineDate: z.string().optional(),
  startingTimelineEvent: z.string().optional(),

  midTimelineIcon: z.string().min(1),
  midTimelineDate: z.string().optional(),
  midTimelineEvent: z.string().optional(),

  endTimelineIcon: z.string().min(1),
  endTimelineDate: z.string().optional(),
  endTimelineEvent: z.string().optional(),

  sponsersImage: z.array(z.string()).min(1, { message: "At least one sponsor image is required" })
});

export const eventUpdateSchema = z.object({
  state: z.string().optional(),

  title: z.string().optional(),
  slug: z.string(),
  manageBy: z.enum(["partners", "self"]).optional(),

  date: z.string().optional(),

  coverImage: z.string().optional(),
  titleImage: z.string().optional(),
  logo: z.string().optional(),
  subImage: z.string().optional(),

  overview: z.string().optional(),
  purpose: z.string().optional(),
  highlight: z.array(z.string()).optional(),

  eventDescription: z.string().optional(),

  startingTimelineIcon: z.string().optional(),
  startingTimelineDate: z.string().optional(),
  startingTimelineEvent: z.string().optional(),

  midTimelineIcon: z.string().optional(),
  midTimelineDate: z.string().optional(),
  midTimelineEvent: z.string().optional(),

  endTimelineIcon: z.string().optional(),
  endTimelineDate: z.string().optional(),
  endTimelineEvent: z.string().optional(),

  sponsersImage: z.array(z.string()).optional()
});
