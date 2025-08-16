import { Schema, model } from "mongoose";

const newsletterEmailSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const NewsletterEmail = model("NewsletterEmail", newsletterEmailSchema);