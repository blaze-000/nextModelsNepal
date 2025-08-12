import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    index: { type: String, required: true },
    name: { type: String, required: true },
    message: { type: String, required: true },
    image: { type: String },
})

export const FeedBackModel = mongoose.model("FeedBackModel", feedbackSchema);