import mongoose from "mongoose";

// Counter model to track uniqueId sequences
const memberCounterSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    seq: { type: Number, default: 0 },
});

const MemberCounterModel = mongoose.model("MemberCounter", memberCounterSchema);

// Member schema
const memberSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    participants: { type: String, required: true },
    uniqueId: { type: String, unique: true },
    bio: { type: String, default: "" },
    images: { type: [String], default: [] },
    icon: { type: String, required: true },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EventSection",
        required: true,
    },
});

// 🔧 Pre-save middleware to generate uniqueId dynamically
memberSchema.pre("save", async function (next) {
    const member = this as any;

    if (!member.isNew) return next();

    // Validate that participants exists and is not null/undefined
    if (!member.participants || typeof member.participants !== 'string') {
        return next(new Error('participants is required and must be a string'));
    }

    const participantsInitial = member.participants.trim().charAt(0).toUpperCase(); // e.g., "R" from "RunnerUP"
    const prefix = `${participantsInitial}-NMN`; // e.g., "R-NMN"

    try {
        // Use the prefix as the counter name for separate counters per participants
        const counter = await MemberCounterModel.findOneAndUpdate(
            { name: prefix },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        const paddedSeq = String(counter.seq).padStart(4, "0"); // e.g., "0001"
        member.uniqueId = `${prefix}-${paddedSeq}`; // e.g., "R-NMN-0001"

        next();
    } catch (err: any) {
        console.error('Error in member pre-save middleware:', err);
        next(err);
    }
});

export const MemberModel = mongoose.model("MemberModel", memberSchema);
