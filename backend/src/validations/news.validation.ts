import { z } from "zod";

export const createNewsSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    link: z.string().min(1, "Link is required").url("Invalid URL format"),
    type: z.enum(["Interview", "Feature", "Announcement"]),
    year: z.string().min(1, "Year is required"),
    event: z.string().optional(),
    // Image is required and handled manually inside controller
});

export const updateNewsSchema = createNewsSchema.partial();