import mongoose from "mongoose";

const cardItemSchema = new mongoose.Schema({
    index: { type: String },  
    criteriaTitle: { type: String, required: true },
    criteria: { type: String, required: true },
    criteriaIcon: { type: String, default: "" }
});

const cardSchema = new mongoose.Schema({
    index: { type: String },  
    cardTitle: { type: String, required: true }, 
    item: { type: [cardItemSchema], default: [] }
});

const nextEventSchema = new mongoose.Schema({
    tag: { type: String, required: true },
    title: { type: String, required: true },
    titleImage: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    noticeName: { type: String, required: true },
    notice: { type: [String], required: true },
    card: { type: [cardSchema], default: [] },
    slug: {type: String, unique: true, default: ""}
});

// Fixed Auto-indexing Middleware
nextEventSchema.pre("save", function(next) {
    this.card.forEach((card, cardIdx) => {
        card.index = card.index || `${cardIdx + 1}`;
        card.item.forEach((item, itemIdx) => {
            item.index = item.index || `${itemIdx + 1}`;
        });
    });
    next();
});

export const NextEventModel = mongoose.model("NEXTEVENT", nextEventSchema);