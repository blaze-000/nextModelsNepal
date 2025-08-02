import mongoose from "mongoose";

const modelSchema = new mongoose.Schema({
    name: { type: String },
    address: { type: String },
    images: { type: [String] },
    icon: { type: String },
    gender: { type: String }
});

export const ModelsModel = mongoose.model("ModelsModel", modelSchema);
