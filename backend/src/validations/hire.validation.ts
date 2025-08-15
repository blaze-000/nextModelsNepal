import { z } from "zod";

export const hireFormSchema = z.object({
    coverTitle: z.string().optional(),
    coverImage: z.string().optional(),
    coverSubImg: z.string().optional(),
    coverDescription: z.string().optional(),

    name: z.string().optional(),
    date: z.string().min(1, "A valid date is required"),
    email: z.email("Invalid email address"),
    phone: z
        .string()
        .min(7, "Phone number must be at least 7 digits")
        .regex(/^[0-9+\-\s()]+$/, "Invalid phone number format"),
    message: z.string().min(1, "Message is required"),
});

export const replySchema = z.object({
    replyMessage: z.string().min(1, "Reply message is required"),
    status: z.enum(['Pending', 'Replied', 'Approved', 'Rejected', 'Under Review']).optional(),
});

