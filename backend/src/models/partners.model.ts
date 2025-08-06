import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema({
    index: { type: Number, required: true },
    sponserName: { type: String, required: true },
    sponserImage: { type: String, required: true }
});

const partnersSchema = new mongoose.Schema({
    partners: { type: [partnerSchema], required: true, default: [] }
});

export const PartnersModel = mongoose.model("PartnersModel", partnersSchema);