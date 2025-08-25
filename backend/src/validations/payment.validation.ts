import { z } from "zod";

const PRICE_PER_VOTE = 1.0;

export const paymentSchema = z.object({
  vote: z.number().positive().int().min(1),
  contestant_Id: z.string().min(1),
  contestant_Name: z.string().optional(),
  prn: z.string().optional(),
  purpose: z.string().optional(),
  r1: z.string().optional(),
  r2: z.string().optional(),
}).transform((data) => ({
  ...data,
  amount: data.vote * PRICE_PER_VOTE,
}));

export { PRICE_PER_VOTE };
