import { z } from "zod";

// Define Zod schema for validation
export const contactFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    subject: z.string().min(1, "Subject is required"),
    email: z.email("Invalid email address"),
    phone: z.string().min(7, "Phone is required"),
    message: z.string().min(1, "Message is required"),
});
