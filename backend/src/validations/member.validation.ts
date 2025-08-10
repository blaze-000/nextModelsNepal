import { z } from "zod";

export const memberSchema = z.object({
    name: z.string().min(1, "Name is required"),
    participants: z.string().min(1, "participants is required"),
    bio: z.string().optional().default(""),
    event: z.string().min(1, "Event ID is required"),
    slug: z.string(),
    year: z.string().optional().transform((val) => {
        if (!val || val.trim() === "") return "2025";
        return val;
    })
});

export const memberUpdateSchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    participants: z.string().min(1, "participants is required").optional(),
    bio: z.string().optional(),
    event: z.string().min(1, "Event ID is required").optional(),
    slug: z.string().optional(),
    year: z.string().optional().transform((val) => {
        if (!val || val.trim() === "") return "2025";
        return val;
    })
}); 