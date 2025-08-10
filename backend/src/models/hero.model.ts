import mongoose from "mongoose";

const heroSchema = new mongoose.Schema({
  maintitle: { type: String, required: false },
  subtitle: { type: String, required: false },
  description: { type: String, required: false },
  images: {
    type: [String],
    default: []
  },
  titleImage: {type: String, required: true}
});

export const HeroModel = mongoose.model("HeroModel", heroSchema);