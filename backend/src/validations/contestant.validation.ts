import { z } from "zod";

export const createContestantSchema = z.object({
  seasonId: z.string().min(1, "Season ID is required"),
  name: z.string().min(1, "Name is required"),
  intro: z.string().min(1, "Intro is required"),
  gender: z.enum(["Male", "Female", "Other"]),
  address: z.string().min(1, "Address is required"),
  image: z.string().url("Image must be a valid URL"),
});


export const updateContestantSchema = createContestantSchema.partial();
