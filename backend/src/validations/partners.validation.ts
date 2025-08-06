import { z } from "zod";

const partnerSchema = z.object({
    index: z.number().optional(),
    sponserName: z.string().min(1, "Sponser name is required"),
    sponserImage: z.string().optional()
});

export const partnersSchema = z.object({
    partners: z.array(partnerSchema).min(1, "At least one partner is required")
});
