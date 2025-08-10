import { z } from "zod";

export const newsSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    content: z.string().optional(),
    year: z.union([z.string(), z.number()]).optional().transform((val) => {
        if (val === undefined) return undefined;
        if (typeof val === 'string') return parseInt(val);
        return val;
    }),
});

// Schema for updates (all fields optional)
export const newsUpdateSchema = z.object({
    title: z.string().min(1, { message: "Title must not be empty" }).optional(),
    description: z.string().min(1, { message: "Description must not be empty" }).optional(),
    content: z.string().optional(),
    year: z.union([z.string(), z.number()]).optional().transform((val) => {
        if (val === undefined) return undefined;
        if (typeof val === 'string') return parseInt(val);
        return val;
    }),
});
