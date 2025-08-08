import mongoose from "mongoose";

const navSchema = new mongoose.Schema({
    label: { type: String, required: true, unique: true },
    path: { type: String, default: '' },
    type: { type: String, enum: ['link', 'dropdown'], default: 'link' },
    children: [
        {
            label: { type: String, required: true },
            path: { type: String, required: true },
            order: { type: Number, default: 1}
        }
    ],
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 1 }
});

export const NavModel = mongoose.model("NavModel", navSchema);