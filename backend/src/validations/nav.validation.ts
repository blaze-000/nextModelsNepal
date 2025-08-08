import { z } from "zod";

// Children schema
const navChildSchema = z.object({
    label: z.string().min(1, "Child label is required"),
    path: z.string().min(1, "Child path is required"),
    order: z.number().optional()
});

// Parent nav item schema
export const navItemSchema = z.object({
    label: z.string().min(1, "label is required"),
    path: z.string().optional(),
    type: z.enum(['link', 'dropdown']).optional(),
    children: z.array(navChildSchema).optional(),
    visible: z.boolean().optional(),
    order: z.number().optional()
});

// Children schema
const navChildUpdateSchema = z.object({
    label: z.string().optional(),
    path: z.string().optional(),
    order: z.number().optional()
});

export const navItemUpdateSchema = z.object({
  label: z.string().optional(),
  path: z.string().optional(),
  type: z.enum(['link', 'dropdown']).optional(),
  children: z.array(navChildUpdateSchema).optional(),
  visible: z.boolean().optional(),
  order: z.number().optional()
});

// For array of nav items (if receiving multiple items)
export const navItemsSchema = z.array(navItemSchema);
