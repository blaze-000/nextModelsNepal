import mongoose from "mongoose";

const appModelSchema = new mongoose.Schema({
    images: [{ type: String, required: true }],
    name: { type: String, required: true },
    phone: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    ethnicity: { type: String, required: true },
    email: { type: String, required: true },

    age: { type: String, required: true },
    languages: {
        type: [String],
        required: true
    },
    gender: { type: String, enum: ["Male", "Female"] },
    occupation: { type: String, required: true },

    dressSize: { type: String, required: true },

    shoeSize: { type: String, required: true },
    hairColor: { type: String, required: true },
    eyeColor: { type: String, required: true },

    event: { type: String },
    auditionPlace: { type: String },

    weight: { type: Number, required: true },

    parentsName: { type: String, required: true },
    parentsMobile: { type: String, required: true },
    parentsOccupation: { type: String },

    permanentAddress: { type: String, required: true },
    temporaryAddress: { type: String, required: true },

    hobbies: { type: String, required: true },
    talents: { type: String },
    heardFrom: { type: String },
    additionalMessage: { type: String },
}, { timestamps: true });


export const AppModel = mongoose.model("AppModel", appModelSchema);
