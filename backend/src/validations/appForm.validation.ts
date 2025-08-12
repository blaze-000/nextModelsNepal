import { z } from "zod";

export const appModelSchema = z.object({
    images: z.array(z.string()).nonempty({ message: "At least one image is required" }),
    name: z.string().min(1, { message: "Name is required" }),
    phone: z.string().min(1, { message: "Mobile number is required" }),
    country: z.string().min(1, { message: "Country is required" }),
    city: z.string().min(1, { message: "City is required" }),
    ethnicity: z.string().min(1, { message: "Ethnicity is required" }),
    email: z.string().email({ message: "Invalid email address" }),

    age: z.string().min(1, { message: "Age is required" }),
    languages: z.array(z.string()).nonempty({ message: "At least one language is required" }),
    gender: z.enum(["Male", "Female", "Other"]).optional(),
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
});
