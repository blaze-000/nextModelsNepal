import mongoose from "mongoose";

const hireSchema = new mongoose.Schema({
    name: { type: String, required: true },
    subject: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, required: true },
    model: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ModelsModel",
        required: true
    },
    replyMessage: { type: String },
    status: { 
        type: String, 
        enum: ['Pending', 'Replied', 'Approved', 'Rejected', 'Under Review'],
        default: 'Pending'
    },
    repliedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field on save
hireSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

export const HireModel = mongoose.model("HireModel", hireSchema); 