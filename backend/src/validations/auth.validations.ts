import { z } from "zod";

export const signupSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string()
        .min(6, "Password must be at least 6 characters")
        .max(25, "Password must be at most 25 characters."),
});
