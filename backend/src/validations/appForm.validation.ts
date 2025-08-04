import { z } from "zod";

export const appModelSchema = z.object({
    images: z.array(z.string()),
    name: z.string().min(1, { message: "Name is required" }),
    phone: z.string().min(1, { message: "Mobile number is required" }),
    country: z.string().min(1, { message: "Country is required" }),
    city: z.string().min(1, { message: "City is required" }),
    ethnicity: z.string().min(1, { message: "Ethnicity is required" }),
    email: z.email({ message: "Invalid email address" }),

    age: z.string().min(1, { message: "Age is required" }),
    languages: z.array(z.string()).nonempty({ message: "At least one language is required" }),
    gender: z.enum(["Male", "Female", "Other"]).optional(),
    occupation: z.string().min(1, { message: "Occupation is required" }),

    dressSize: z.string().optional(),
    shoeSize: z.string().optional(),
    hairColor: z.string().optional(),
    eyeColor: z.string().optional(),

    selectEvent: z.any().optional(),
    event: z.string().optional(),
    auditionPlace: z.string().optional(),

    weight: z.number().optional(),

    parentsName: z.string().min(1, { message: "Parent's name is required" }),
    parentsMobile: z.string().min(1, { message: "Parent's mobile number is required" }),
    parentsOccupation: z.string().optional(),

    permanentAddress: z.string().min(1, { message: "Permanent address is required" }),
    temporaryAddress: z.string().optional(),

    hobbies: z.string().optional(),
    talents: z.string().optional(),
    hearedFrom: z.string().optional(),
    message: z.string().optional(),
});
