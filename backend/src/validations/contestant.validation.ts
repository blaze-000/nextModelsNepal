import { z } from "zod";

export const createContestantSchema = z.object({
  seasonId: z.string().min(1, "Season ID is required"),
  name: z.string().min(1, "Name is required"),
  intro: z.string().min(1, "Intro is required"),
  gender: z.enum(["Male", "Female"]),
  address: z.string().min(1, "Address is required"),
  status: z.string()
  // Image will be handled separately as a file upload
});

export const updateContestantSchema = createContestantSchema.partial().omit({ seasonId: true });