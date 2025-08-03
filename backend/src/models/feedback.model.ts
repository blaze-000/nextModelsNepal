import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    index: String,
    name: String,
    message: String,
    images: {
        type: [String],
    },
})

const feedbackSchema = new mongoose.Schema({
    maintitle: { type: String, required: true },
    item: { type: [commentSchema] }
});

export const FeedBackModel = mongoose.model("FeedBackModel", feedbackSchema);