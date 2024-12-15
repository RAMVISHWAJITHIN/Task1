// models/eventModel.js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        tagline: { type: String, required: true },
        schedule: { type: Date, required: true },
        moderator: { type: String, required: true },
        category: { type: String, required: true },
        sub_category: { type: String, required: true },
        rigor_rank: { type: Number, required: true },
        attendees: { type: [Number], required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
