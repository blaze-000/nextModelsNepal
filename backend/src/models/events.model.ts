import mongoose from "mongoose";

const eventCounterSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    seq: { type: Number, default: 0 }
});

// Create a model for the counter collection
const Counter = mongoose.model('Counter', eventCounterSchema);

const eventSchema = new mongoose.Schema({
    index: { type: Number, unique: true, default: "1" },
    tag: { type: String },
    title: { type: String, required: true },
    date: { type: String },
    description: { type: String, required: true },
    content: { type: String },
    participants: { type: String },
    images: { type: [String] },
    icon: { type: String, require: true, default: [] },
    Member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MemberModel",
        required: true,
    },
});

eventSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findOneAndUpdate(
                { name: 'eventIndex' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            this.index = counter.seq;
            next();
        } catch (err: any) {
            next(err);
        }
    } else {
        next();
    }
});

export const EventModel = mongoose.model("EventSection", eventSchema);