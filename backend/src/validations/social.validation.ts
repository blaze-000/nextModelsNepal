import { z } from "zod";

export const socialSchema = z.object({
    instagram: z.string(),
    x: z.string(),
    fb: z.string(),
    linkdln: z.string(),
    phone: z.string(),
    mail: z.string(),
    location: z.string(),
});

export const updateSocialSchema = z.object({
    instagram: z.string().optional(),
    x: z.string().optional(),
    fb: z.string().optional(),
    linkdln: z.string().optional(),
    phone: z.string().optional(),
    mail: z.string().optional(),
    location: z.string().optional(),
});
