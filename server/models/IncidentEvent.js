const mongoose = require("mongoose");

const incidentEventSchema = new mongoose.Schema({
    incidentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Incident",
        required: true
    },

    type: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true
    },

    timestamp: {
        type: Date,
        default: Date.now
    }
});

const IncidentEvent = mongoose.model(
    "IncidentEvent",
    incidentEventSchema
);

module.exports = IncidentEvent;