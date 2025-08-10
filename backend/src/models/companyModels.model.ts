import mongoose from "mongoose";

const COMMODELSchema = new mongoose.Schema({
    name: { type: String, required: true },
    intro: {type: String, required: true},
    address: { type: String, required: true },
    coverImage: {type: String, required: true},
    images: { type: [String], default: [] },
    gender: { type: String, required: true },
    slug: {type: String, required: true, default: ""},
});

export const COMMODEL = mongoose.model("COMMODEL", COMMODELSchema);
