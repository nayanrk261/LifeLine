const IncidentEvent = require("../models/IncidentEvent");

async function createIncidentEvent(incidentId, type, message) {
    const event = await IncidentEvent.create({
        incidentId,
        type,
        message,
        timestamp: new Date()
    });

    return event;
}

module.exports = { createIncidentEvent };