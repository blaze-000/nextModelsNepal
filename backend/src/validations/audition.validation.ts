import { z } from "zod";

export const createAuditionSchema = z.object({
  seasonId: z.string().min(1, "Season ID is required"), // MongoDB ObjectId
  date: z.coerce.date(),
  place: z.string().min(1, "Place is required"),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
});

export const updateAuditionSchema = createAuditionSchema.partial();
