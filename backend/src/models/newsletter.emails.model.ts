import { Schema, model } from "mongoose";

const newsletterEmailSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const NewsletterEmail = model("NewsletterEmail", newsletterEmailSchema);

const newsletterSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: [{ type: String }],
    descriptionOpt: {
        type: String,
    },
    imageOpt: [{ type: String }],
    linkLabel: { type: String },
    link: { type: String },
    websiteLink: {
        type: String,
        default: "https://nextmodelsnepal.com/"
    },
    sentTo: { type: Number, default: 0 },
    totalSubscribers: { type: Number, default: 0 },
    failedCount: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['sent', 'failed', 'partial'],
        default: 'sent'
    }
}, {
    timestamps: true,
    collection: 'sent_newsletters' // Use a different collection name to avoid conflicts
});

export const Newsletter = model("Newsletter", newsletterSchema);