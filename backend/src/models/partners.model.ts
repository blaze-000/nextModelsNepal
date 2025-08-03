import mongoose from "mongoose";

const partnersSchema = new mongoose.Schema({
    maintitle: { type: String, required: true },
    description: { type: String, required: true },
    icon: {
        type: [String],
    },
    images: String
});

export const PartnersModel = mongoose.model("PartnersModel", partnersSchema);