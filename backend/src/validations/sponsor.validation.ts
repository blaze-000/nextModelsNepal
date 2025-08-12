import { z } from "zod";

export const createSponsorSchema = z.object({
  seasonId: z.string().min(1, "Season ID is required"),
  name: z.string().min(1, "Sponsor name is required"),
  // Image will be handled separately as a file upload
});

export const updateSponsorSchema = createSponsorSchema.partial().omit({ seasonId: true });