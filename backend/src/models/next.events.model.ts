import mongoose from "mongoose";

const NextEventSchema = new mongoose.Schema({
    title: String,
    heading: String,
    description: String,
    images: { type: [String], default: [] },
    subtitle: {
        type: [{
            index: String,
            name: { type: String, required: true },
            icon: { type: [String], default: [] },
            items: {
                type: [{
                    index: String,
                    tag: String,
                    tagContent: String,
                    tagIcon: { type: [String], default: [] }
                }],
                default: []
            }
        }],
        default: []
    },
    notice: { type: [String], default: [] }
});

// Middleware to auto-generate indexes
NextEventSchema.pre("save", function (next) {
    this.subtitle.forEach((sub, subIdx) => {
        sub.index = sub.index || `${subIdx + 1}`;
        sub.items.forEach((item, itemIdx) => {
            item.index = item.index || `${itemIdx + 1}`;
        });
    });
    next();
});

export const NextEventModel = mongoose.model("NextEventSection", NextEventSchema);
