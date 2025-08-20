import { Schema, model } from "mongoose";

const socialSchema = new Schema({
    instagram: { type: String, required: true },
    x: { type: String, required: true },
    fb: { type: String, required: true },
    linkdln: { type: String, required: true },
    phone: { type: [String], required: true },
    mail: { type: String, required: true },
    location: { type: String, required: true }
});

export const socialModel = model("Social", socialSchema);