import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    index: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    message: { type: String, required: true },
    image: { type: String, unique: true },
}, { timestamps: true });

export const FeedBackModel = mongoose.model("FeedBackModel", feedbackSchema);
