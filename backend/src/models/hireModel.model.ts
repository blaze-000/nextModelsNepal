import mongoose from "mongoose";

const hireSchema = new mongoose.Schema({
    name: {type: String},
    model: { type: mongoose.Schema.Types.ObjectId, ref: "COMMODEL", required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: String, required: true },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field on save
hireSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

export const HireModel = mongoose.model("HireModel", hireSchema); 