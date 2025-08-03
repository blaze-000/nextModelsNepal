import { z } from "zod";

const commentSchema = z.object({
    index: z.string().optional(),
    name: z.string().optional(),
    message: z.string().optional(),
    images: z.array(z.string()).optional()
});

export const feedbackSchema = z.object({
    maintitle: z.string(),
    item: z.array(commentSchema).optional()
});
