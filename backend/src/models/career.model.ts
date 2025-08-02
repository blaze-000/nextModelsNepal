import mongoose from "mongoose";

const careerSchema = new mongoose.Schema({
    maintitle: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
    images: {
        type: [String],
    },
    link: String
});

export const CareerModel = mongoose.model("CareerModel", careerSchema);