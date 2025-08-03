import mongoose from "mongoose";

const navSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    path: { type: String, default: '' },
    link: { type: String },
    type: { type: String, enum: ['link', 'dropdown'], default: 'link' },
    children: [
        {
            title: { type: String, required: true },
            path: { type: String, required: true },
            link: { type: String, required: true },
            order: { type: Number, default: 0 }
        }
    ],
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
});

export const NavModel = mongoose.model("NavModel", navSchema);