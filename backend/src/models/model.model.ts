import mongoose from "mongoose";

const ModelSchema = new mongoose.Schema({
    index: { type: Number, required: true, unique: true},
    name: { type: String, required: true },
    intro: {type: String, required: true},
    address: { type: String, required: true },
    coverImage: {type: String, required: true},
    images: { type: [String] },
    gender: { type: String, required: true },
    slug: {type: String, required: true, unique: true},
}, { timestamps: true });

export const Model = mongoose.model("Model", ModelSchema);