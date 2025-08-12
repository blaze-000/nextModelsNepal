import { z } from "zod";

export const createJurySchema = z.object({
    seasonId: z.string().min(1, "Season ID is required"),
    name: z.string().min(1, "Jury name is required"),
    designation: z.string().optional(),
    // Image will be handled separately as a file upload
});

export const updateJurySchema = createJurySchema.partial().omit({ seasonId: true });