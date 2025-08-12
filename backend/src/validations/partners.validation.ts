import { z } from "zod";

export const createPartnersSchema = z.object({
    sponserName: z.string().min(1, "Sponsor name is required"),
    // sponserImage is handled by multer and controller, so not in body validation
});

export const updatePartnersSchema = createPartnersSchema.partial();