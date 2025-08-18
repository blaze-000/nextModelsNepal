import { z } from "zod";

export const createCriteriaSchema = z.object({
  seasonId: z.string().min(1, "Season ID is required"),
  label: z.string().min(1, "Criteria label is required"),
  value: z.string().min(1, "Value is required."),
  // Icon will validated inside the controller
});

export const updateCriteriaSchema = createCriteriaSchema.partial();
