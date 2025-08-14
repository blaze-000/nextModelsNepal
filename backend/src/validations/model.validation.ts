import { z } from "zod";

export const createModelSchema = z.object({
  order: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  intro: z.string().min(1, "Introduction is required"),
  address: z.string().min(1, "Address is required"),
  gender: z.string().min(1, "Gender is required"),
  slug: z.string().min(1, "Slug is required"),
  // coverImage and images are handled separately inside multer
});

export const updateModelSchema = createModelSchema.partial();