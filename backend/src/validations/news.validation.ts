import { z } from "zod";

const coverageSchema = z.object({
    index: z.string().optional(),
    images: z.array(z.string()).optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    link: z.string().optional()
});

export const newsSchema = z.object({
    maintitle: z.string(),
    description: z.string(),
    item: z.array(coverageSchema).optional()
});
