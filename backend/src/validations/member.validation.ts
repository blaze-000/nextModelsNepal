import { z } from "zod";

export const memberSchema = z.object({
    name: z.string().min(1, "Name is required"),
    participants: z.string().min(1, "participants is required"),
    bio: z.string().optional().default(""),
    event: z.string().min(1, "Event ID is required"),
});

export const memberUpdateSchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    participants: z.string().min(1, "participants is required").optional(),
    bio: z.string().optional(),
    event: z.string().min(1, "Event ID is required").optional(),
}); 