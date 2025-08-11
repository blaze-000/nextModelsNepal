import mongoose from "mongoose";

const eventCounterSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    seq: { type: Number, default: 0 }
});

// Create a model for the counter collection
const Counter = mongoose.model('Counter', eventCounterSchema);

const eventSchema = new mongoose.Schema({
    index: { type: Number, unique: true },
    state: { type: String },
    coverImage: { type: String },
    title: { type: String, required: true },

    slug: {type: String, required: true, unique: true},
    manageBy:{type: String,  enum: ["partners", "self"], default: "self"}, 
    titleImage: {type: String, default: ""},

    date: { type: String },
    year: { type: String, default: "2025" },
    overview: { type: String, required: true },
    logo: { type: String, required: true },
    subImage: { type: String, default: "" },
    purpose: { type: String },
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MemberModel",
    },
    highlight: { type: [String], default: [] },

    // Event Timeline 
    eventDescription: { type: String },

    startingTimelineIcon: { type: String, required: true },
    startingTimelineDate: { type: String },
    startingTimelineEvent: { type: String },

    midTimelineIcon: { type: String, required: true },
    midTimelineDate: { type: String },
    midTimelineEvent: { type: String },

    endTimelineIcon: { type: String, required: true },
    endTimelineDate: { type: String },
    endTimelineEvent: { type: String },

    // sponsers
    sponsersImage: { type: [String], required: true, default: [] }

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