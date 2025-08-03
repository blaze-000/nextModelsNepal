import { z } from "zod";

export const eventZodSchema = z.object({
    index: z.number().optional(),
    tag: z.string().optional(),
    title: z.string(),
    date: z.string().optional(),
    description: z.string(),
    content: z.string().optional(),
    participants: z.string().optional(),
    images: z.array(z.string()).optional(),
});
