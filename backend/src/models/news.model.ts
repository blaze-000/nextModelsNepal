import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String },
    type: {
        type: String,
        enum: ["Interview", "Feature", "Announcement"], required: true
    },
    year: {
        type: Number,
        default: () => new Date().getFullYear(),
        required: true
    },
    image: { type: String },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EventModel"
    }
});

export const NewsModel = mongoose.model("NewsModel", newsSchema);