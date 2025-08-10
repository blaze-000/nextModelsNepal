import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    index: { type: String, required: true },
    name: { type: String, required: true },
    message: { type: String, required: true },
    images: {
        type: [String],
        default: []
    },
})

const feedbackSchema = new mongoose.Schema({
    item: { type: [commentSchema], required: true, default: [] }
});

export const FeedBackModel = mongoose.model("FeedBackModel", feedbackSchema);