// validations/sponsor.validation.ts
import { z } from "zod";

export const createSponsorSchema = z.object({
  seasonId: z.string().min(1, "Season ID is required"),
  name: z.string().min(1, "Sponsor name is required"),
  image: z.string().url("Image must be a valid URL"),
});

export const updateSponsorSchema = createSponsorSchema.partial();
