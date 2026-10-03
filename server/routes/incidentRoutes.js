const express = require("express");
const Incident = require("../models/Incident");
const IncidentEvent = require("../models/IncidentEvent");

const router = express.Router();

router.get("/", async (req, res) => {
    const incidents = await Incident.find();

    res.json(incidents);
});

router.get("/:id", async (req, res) => {
    const incident = await Incident.findById(req.params.id);

    res.json(incident);
});

router.get("/:id/events", async (req, res) => {
    const events = await IncidentEvent.find({
        incidentId: req.params.id
    }).sort({ timestamp: 1 });

    res.json(events);
});

module.exports = router;