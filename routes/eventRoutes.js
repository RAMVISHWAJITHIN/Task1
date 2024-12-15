
const express = require("express");
const Event = require("../models/eventModel");

const router = express.Router();

router.get("/events/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json(event);
    } catch (err) {
        res.status(500).json({ message: "Error fetching event", error: err.message });
    }
});


router.get("/events", async (req, res) => {
    const { page = 1, limit = 5 } = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
        return res.status(400).json({ message: "Invalid page or limit value." });
    }

    try {
        const events = await Event.find()
            .skip((pageNumber - 1) * limitNumber) 
            .limit(limitNumber); 

        const totalEvents = await Event.countDocuments();
        const totalPages = Math.ceil(totalEvents / limitNumber); 

        res.json({
            events,
            pagination: {
                currentPage: pageNumber,
                totalPages,
                totalEvents,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch events", error: err.message });
    }
});

router.post("/events", async (req, res) => {
    const {
        name,
        description,
        tagline,
        schedule,
        moderator,
        category,
        sub_category,
        rigor_rank,
        attendees,
    } = req.body;

    try {
        const newEvent = new Event({
            name,
            description,
            tagline,
            schedule,
            moderator,
            category,
            sub_category,
            rigor_rank,
            attendees,
        });

        await newEvent.save();
        res.status(201).json({ message: "Event created successfully", event: newEvent });
    } catch (err) {
        res.status(500).json({ message: "Error creating event", error: err.message });
    }
});


router.put("/events/:id", async (req, res) => {
    const { id } = req.params;
    const {
        name,
        description,
        tagline,
        schedule,
        moderator,
        category,
        sub_category,
        rigor_rank,
        attendees,
    } = req.body;

    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            {
                name,
                description,
                tagline,
                schedule,
                moderator,
                category,
                sub_category,
                rigor_rank,
                attendees,
            },
            { new: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json({ message: "Event updated successfully", event: updatedEvent });
    } catch (err) {
        res.status(500).json({ message: "Error updating event", error: err.message });
    }
});


router.delete("/events/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const deletedEvent = await Event.findByIdAndDelete(id);

        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json({ message: "Event deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting event", error: err.message });
    }
});

module.exports = router;
