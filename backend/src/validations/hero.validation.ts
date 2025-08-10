import { array, z } from "zod";

// Parent hero item schema
export const heroItemSchema = z.object({
    _id: z.string().optional(),
    maintitle: z.string().optional(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    images: z
        .array(z.string().min(1, 'Image path is required.'))
        .default([]).optional(),
    titleImage: z.string().optional() // Made optional since it's handled as file upload
});