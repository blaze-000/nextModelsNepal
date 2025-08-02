import { z } from "zod";

// Children schema
const navChildSchema = z.object({
    title: z.string().min(1, "Child title is required"),
    path: z.string().min(1, "Child path is required"),
    link: z.string(),
    order: z.number().optional().default(0)
});

// Parent nav item schema
export const navItemSchema = z.object({
    _id: z.string().optional(),
    title: z.string().min(1, "Title is required"),
    path: z.string().optional().default(''),
    link: z.string().optional(),
    type: z.enum(['link', 'dropdown']).optional().default('link'),
    children: z.array(navChildSchema).optional().default([]),
    visible: z.boolean().optional().default(true),
    order: z.number().optional().default(0)
});

// For array of nav items (if receiving multiple items)
export const navItemsSchema = z.array(navItemSchema);
