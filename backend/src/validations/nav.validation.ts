
import { z } from "zod";

// Main navigation schema
export const navSchema = z.object({
  showVoting: z.boolean().default(true)
});