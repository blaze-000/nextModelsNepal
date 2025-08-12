import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    subject: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    // status: {
    //     type: String,
    //     enum: ['new', 'read', 'replied', 'archived'],
    //     default: 'new'
    // },
    // replied: {
    //     type: Boolean,
    //     default: false,
    // },
    createdAt: { type: Date, default: Date.now },
    // updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field on save
// contactSchema.pre('save', function (next) {
//     this.updatedAt = new Date();
//     next();
// });

export const ContactModel = mongoose.model("ContactModel", contactSchema); 