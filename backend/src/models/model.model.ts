import mongoose from "mongoose";

const ModelSchema = new mongoose.Schema({
    index: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    intro: {type: String, required: true},
    address: { type: String, required: true },
    coverImage: {type: String, required: true},
    images: { type: [String] },
    gender: { type: String, required: true },
    slug: {type: String, required: true},
}, { timestamps: true });

// Add indexing for efficient index-based queries
ModelSchema.index({ index: 1 });

export const Model = mongoose.model("Model", ModelSchema);