const { getDB } = require("../db");
const { ObjectId } = require("mongodb");

exports.getEventById = async (req, res) => {
    const db = getDB();
    try {
        const event = await db
            .collection("events")
            .findOne({ _id: new ObjectId(req.params.id) });
        if (!event) return res.status(404).json({ message: "Event not found" });
        res.json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const Event = require("../models/eventModel");

const getEvents = async (req, res) => {
    try {
    
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10;  
        const skip = (page - 1) * limit;

        
        const events = await Event.find().skip(skip).limit(limit);
        const totalEvents = await Event.countDocuments(); 

        res.json({
            totalEvents,
            currentPage: page,
            totalPages: Math.ceil(totalEvents / limit),
            events,
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};

exports.getEventsPaginated = async (req, res) => {
    const db = getDB();
    const { page = 1, limit = 5 } = req.query;
    try {
        const events = await db
            .collection("events")
            .find()
            .sort({ schedule: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .toArray();
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createEvent = async (req, res) => {
    const db = getDB();
    try {
        const payload = req.body;
        const result = await db.collection("events").insertOne(payload);
        res.status(201).json({ id: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateEvent = async (req, res) => {
    const db = getDB();
    try {
        const update = req.body;
        await db
            .collection("events")
            .updateOne({ _id: new ObjectId(req.params.id) }, { $set: update });
        res.json({ message: "Event updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteEvent = async (req, res) => {
    const db = getDB();
    try {
        await db
            .collection("events")
            .deleteOne({ _id: new ObjectId(req.params.id) });
        res.json({ message: "Event deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
