import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String, required: true },
  type: {
    type: String,
    enum: ["Interview", "Feature", "Announcement"],
    required: true,
    default: "Feature",
  },
  year: {
    type: String,
    default: () => String(new Date().getFullYear()),
    required: true,
  },
  image: { type: String, required: true },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
});

export const NewsModel = mongoose.model("NewsModel", newsSchema);
