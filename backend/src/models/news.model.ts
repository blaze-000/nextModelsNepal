import mongoose from "mongoose";

const coverageSchema = new mongoose.Schema({
    index: String,
    images: {
        type: [String],
    },
    title: String,
    description: String,
    link: String
})

const newsSchema = new mongoose.Schema({
    maintitle: { type: String, required: true },
    description: { type: String, required: true },
    item: { type: [coverageSchema] }
});

export const NewsModel = mongoose.model("NewsModel", newsSchema);