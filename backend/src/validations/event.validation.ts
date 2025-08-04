import { z } from "zod";

export const eventZodSchema = z.object({
    index: z.number().optional(),
    tag: z.string().optional(),
    title: z.string().min(1, { message: "Title is required" }),
    date: z.string().optional(),
    overview: z.string().min(1, { message: "Overview is required" }),
    purpose: z.string().optional(),
    highlight: z.array(z.string()).optional(),

    //Event Timeline
    eventDescription: z.string(),

    startingTimelineDate: z.string(),
    startingTimelineEvent: z.string(),

    midTimelineDate: z.string(),
    midTimelineEvent: z.string(),

    endTimelineDate: z.string(),
    endTimelineEvent: z.string()
});
