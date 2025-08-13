import mongoose from "mongoose";

const heroSchema = new mongoose.Schema({
  titleImage: { type: String, required: true },
  image_1: { type: String, default: "" },
  image_2: { type: String, default: "" },
  image_3: { type: String, default: "" },
  image_4: { type: String, default: "" },
});

export const HeroModel = mongoose.model("HeroModel", heroSchema);
