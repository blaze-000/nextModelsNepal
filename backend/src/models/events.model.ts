import mongoose from "mongoose";
const { Schema } = mongoose;

/** Event Schema */
const eventSchema = new Schema({
    name: { type: String, required: true },
    overview: { type: String, required: true },
    titleImage: { type: String, required: true },
    coverImage: { type: String, required: true },
    subtitle: { type: String, required: true },
    quote: { type: String, required: true },
    purpose: { type: String, required: true },
    purposeImage: { type: String, required: true },
    timelineSubtitle: { type: String, required: true },
    managedBy: { type: String, enum: ["self", "partner"] },
    seasons: [{ type: Schema.Types.ObjectId, ref: "Season" }],
}, { timestamps: true });

/** Season Schema */
const seasonSchema = new Schema({
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    year: { type: Number, required: true },
    image: { type: String, required: true },
    status: { type: String, required: true, enum: ["upcoming", "ongoing", "ended"] },
    startDate: { type: Date, required: true },
    auditionFormDeadline: { type: Date },
    votingOpened: { type: Boolean },
    votingEndDate: { type: Date },
    endDate: { type: Date, required: true },
    slug: { type: String, required: true, unique: true },
    getTicketLink: { type: String },
    pricePerVote: { type: Number },
    posterImage: { type: String },
    gallery: [{ type: String }],
    notice: [{ type: String }],

    // Embedded timeline array (small & tightly coupled)
    timeline: [{
        label: { type: String },
        datespan: { type: String },
        icon: { type: String }
    }]
}, { timestamps: true });

/** Virtuals for season to populate children */

seasonSchema.virtual("contestants", {
    ref: "Contestant",
    localField: "_id",
    foreignField: "seasonId",
});

seasonSchema.virtual("winners", {
    ref: "Winner",
    localField: "_id",
    foreignField: "seasonId",
});

seasonSchema.virtual("jury", {
    ref: "Jury",
    localField: "_id",
    foreignField: "seasonId",
});

seasonSchema.virtual("sponsors", {
    ref: "Sponsor",
    localField: "_id",
    foreignField: "seasonId",
});

seasonSchema.virtual("criteria", {
    ref: "Criteria",
    localField: "_id",
    foreignField: "seasonId",
});

seasonSchema.virtual("auditions", {
    ref: "Audition",
    localField: "_id",
    foreignField: "seasonId",
});

/** Enable virtuals when converting to JSON or Object */
seasonSchema.set("toObject", { virtuals: true });
seasonSchema.set("toJSON", { virtuals: true });

/** Helper: keep seasons array updated in Event when Season is created or deleted */
seasonSchema.post("save", async function (doc) {
    try {
        await EventModel.findByIdAndUpdate(
            doc.eventId,
            { $addToSet: { seasons: doc._id } }
        );
    } catch (error) {
        console.error(`Error updating event with season:`, error);
    }
});

seasonSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        try {
            await EventModel.findByIdAndUpdate(
                doc.eventId,
                { $pull: { seasons: doc._id } }
            );
        } catch (error) {
            console.error(`Error removing season from event:`, error);
        }
    }
});

/** Contestant Schema */
const contestantSchema = new Schema({
    seasonId: { type: Schema.Types.ObjectId, ref: "Season", required: true },
    uniqueId: { type: String, unique: true },
    name: { type: String, required: true },
    intro: { type: String, required: true },
    gender: { type: String, required: true, enum: ["Male", "Female"] },
    address: { type: String, required: true },
    image: { type: String, required: true },
    votes: {type: Number, default: 0}
});

// Counter model to track uniqueId sequences
const memberCounterSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    seq: { type: Number, default: 0 },
});

// Pre-save middleware to generate uniqueId dynamically
contestantSchema.pre("save", async function (next) {
    const member = this as any;

    if (!member.isNew) return next();

    const prefix = `NMN`; // e.g., "R-NMN"

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

/** Winner Schema */
const winnerSchema = new Schema({
    seasonId: { type: Schema.Types.ObjectId, ref: "Season", required: true },
    rank: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    slug: { type: String }
});

/** Jury Schema */
const jurySchema = new Schema({
    seasonId: { type: Schema.Types.ObjectId, ref: "Season", required: true },
    name: { type: String, required: true },
    designation: { type: String, default: "Jury" },
    image: { type: String, required: true }
});

/** Sponsor Schema */
const sponsorSchema = new Schema({
    seasonId: { type: Schema.Types.ObjectId, ref: "Season", required: true },
    name: { type: String, required: true },
    image: { type: String, required: true }
});

/** Criteria Schema */
const criteriaSchema = new Schema({
    seasonId: { type: Schema.Types.ObjectId, ref: "Season", required: true },
    label: { type: String },
    value: { type: String },
    icon: { type: String }
});

/** Audition Schema with conditional validation */
const auditionSchema = new Schema({
    seasonId: { type: Schema.Types.ObjectId, ref: "Season", required: true },
    place: { type: String },
    date: { type: Date }
});

/** Models export */
export const EventModel = mongoose.model("Event", eventSchema);
export const SeasonModel = mongoose.model("Season", seasonSchema);
export const ContestantModel = mongoose.model("Contestant", contestantSchema);
const MemberCounterModel = mongoose.model("MemberCounter", memberCounterSchema);
export const WinnerModel = mongoose.model("Winner", winnerSchema);
export const JuryModel = mongoose.model("Jury", jurySchema);
export const SponsorModel = mongoose.model("Sponsor", sponsorSchema);
export const CriteriaModel = mongoose.model("Criteria", criteriaSchema);
export const AuditionModel = mongoose.model("Audition", auditionSchema);
