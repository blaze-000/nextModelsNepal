import { z } from "zod";

export const paymentSchema = z.object({
  amount: z.number().positive(),
  vote: z.number().positive(),
  contestant: z.string().min(1), // ObjectId string
  prn: z.string().optional(),
  description: z.string().optional(),
  r1: z.string().optional(),
  r2: z.string().optional(),
});
