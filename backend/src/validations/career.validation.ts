import { z } from "zod";

export const careerSchema = z.object({
    maintitle: z.string(),
    subtitle: z.string(),
    description: z.string(),
    images: z.array(z.string()).optional(),
    link: z.string().optional()
});
