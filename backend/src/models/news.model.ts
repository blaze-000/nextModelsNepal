import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: {type: String},
    year: { type: Number, default: () => new Date().getFullYear() },
    images: {
        type: [String],
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EventModel"
    }
});

export const NewsModel = mongoose.model("NewsModel", newsSchema);