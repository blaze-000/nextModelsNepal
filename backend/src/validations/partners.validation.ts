import { z } from "zod";

export const partnersSchema = z.object({
    maintitle: z.string(),
    description: z.string(),
    icon: z.array(z.string()).optional(),
    images: z.string().optional()
});
