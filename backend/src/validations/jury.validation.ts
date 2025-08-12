// validations/jury.validation.ts
import { z } from "zod";

export const createJurySchema = z.object({
    seasonId: z.string().min(1, "Season ID is required"),
    name: z.string().min(1, "Jury name is required"),
    designation:z.string().optional(),
    image: z.string().url("Image must be a valid URL"),
});

export const updateJurySchema = createJurySchema.partial();
