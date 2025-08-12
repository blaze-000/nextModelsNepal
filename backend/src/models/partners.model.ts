import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema({
    sponserName: { type: String, required: true },
    sponserImage: { type: String, required: true }
});

export const PartnersModel = mongoose.model("PartnersModel", partnerSchema);