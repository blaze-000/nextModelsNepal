import mongoose from "mongoose";

const heroSchema = new mongoose.Schema({
  maintitle: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: { type: String, required: true },
  images: {
    type: [String],
  }
});

export const HeroModel = mongoose.model("HeroModel", heroSchema);