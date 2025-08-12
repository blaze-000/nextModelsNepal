import { z } from "zod";

export const createWinnerSchema = z.object({
  seasonId: z.string().min(1, "Season ID is required"),
  rank: z.string().min(1, "Rank is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  // Image will be handled separately as a file upload
});

export const updateWinnerSchema = createWinnerSchema.partial().omit({ seasonId: true });