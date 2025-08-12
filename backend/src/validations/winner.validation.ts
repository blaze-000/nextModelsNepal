import { z } from "zod";

export const createWinnerSchema = z.object({
  seasonId: z.string().min(1, "Season ID is required"),
  rank: z.string().min(1, "Rank is required"),
  name: z.string().min(1, "Name is required"),
  image: z.string().url("Image must be a valid URL"),
  slug: z.string().optional(),
});

export const updateWinnerSchema = createWinnerSchema.partial();