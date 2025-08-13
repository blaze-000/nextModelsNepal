import mongoose from "mongoose";

const navSchema = new mongoose.Schema({
    showVoting: { type: Boolean, default: true },
});

export const NavModel = mongoose.model("NavModel", navSchema);