const CheckResult = require("../models/CheckResult");
const Incident = require("../models/Incident");
const { createIncidentEvent } = require("./incidentEventService");

function hasIncidentPattern(results){
    const latestThree = results.slice(-3);

    if (latestThree.length < 3) {
    return false;
    }

    const allFailed = latestThree.every(result => !result.success);
    return allFailed;
}

async function detectIncident(applicationId) {

    const results = await CheckResult.find({
    applicationId
    })
    .sort({ timestamp: -1 })
    .limit(3);

    return hasIncidentPattern(results);
}

async function createIncidentIfNeeded(applicationId) {

    const incidentDetected = await detectIncident(applicationId);

    const activeIncident = await Incident.findOne({
        applicationId: applicationId,
        status: "active"
    });

    if (!incidentDetected) {
        return null;
    }

    if (activeIncident) {
        return activeIncident;
    }

    const newIncident = await Incident.create({
        applicationId: applicationId,
        status: "active",
        startedAt: new Date(),
        reason: "3 consecutive health check failures"
    });

    await createIncidentEvent(
        newIncident._id,
        "incident_started",
        "Incident detected after 3 consecutive health check failures"
    );

    return newIncident;
}

async function resolveIncidentIfRecovered(applicationId) {

    const activeIncident = await Incident.findOne({
    applicationId: applicationId,
    status: "active"
    })

    if(activeIncident === null) {
        return null;
    }

    const latestCheck = await CheckResult.findOne({
    applicationId
    }).sort({ timestamp: -1 });

    if (!latestCheck) {
    return null;
    }

    if (latestCheck.success) {
    activeIncident.status = "resolved";
    activeIncident.resolvedAt = new Date();

    await activeIncident.save();

    await createIncidentEvent(
    activeIncident._id,
    "incident_resolved",
    "Application recovered and incident resolved"
    );

    return activeIncident;
    }
    
}

module.exports = { hasIncidentPattern , detectIncident , createIncidentIfNeeded , resolveIncidentIfRecovered};