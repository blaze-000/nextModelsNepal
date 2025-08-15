import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
	order: { type: Number, required: true, unique: true }, // Sorting order
	name: { type: String, required: true },
	message: { type: String, required: true },
	image: { type: String, required: true },
},
	{ timestamps: true }
);

export const Feedback = mongoose.model("Feedback", feedbackSchema);
