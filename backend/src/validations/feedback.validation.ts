import { z } from "zod";

const commentSchema = z.object({
    index: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    message: z.string().min(1, "Message is required"),
    image: z.string().optional(),
    images: z.array(z.string()).optional().default([])
});

export const feedbackSchema = z.object({
    item: z.array(commentSchema).min(1, "At least one feedback item is required")
});
