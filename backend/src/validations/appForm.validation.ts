import { z } from "zod";

export const appModelSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    phone: z
        .string()
        .regex(/^(\+\d{1,3}[- ]?)?\d{6,15}$/, {
            message: "Invalid mobile number"
        }),
    country: z.string().min(1, { message: "Country is required" }),
    city: z.string().min(1, { message: "City is required" }),
    ethnicity: z.string().min(1, { message: "Ethnicity is required" }),
    email: z.string().email({ message: "Invalid email address" }),

    age: z.string().min(1, { message: "Age is required" }),
    languages: z.array(z.string()).min(1, { message: "At least one language is required" }),
    gender: z.enum(["Male", "Female"]).optional(),
    occupation: z.string().min(1, { message: "Occupation is required" }),

    dressSize: z.string().min(1, { message: "Dress size is required" }),
    shoeSize: z.string().min(1, { message: "Shoe size is required" }),
    hairColor: z.string().min(1, { message: "Hair color is required" }),
    eyeColor: z.string().min(1, { message: "Eye color is required" }),

    event: z.string().optional(),
    auditionPlace: z.string().optional(),

    weight: z.number().min(1, { message: "Weight is required" }),

    parentsName: z.string().min(1, { message: "Parent's name is required" }),
    parentsMobile: z.string().min(1, { message: "Parent's mobile number is required" }),
    parentsOccupation: z.string().optional(),

    permanentAddress: z.string().min(1, { message: "Permanent address is required" }),
    temporaryAddress: z.string().min(1, { message: "Temporary address is required" }),

    hobbies: z.string().min(1, { message: "Hobbies are required" }),
    talents: z.string().optional(),
    heardFrom: z.string().optional(),
    additionalMessage: z.string().optional(),

    // Images will validated inside controller manually
});
