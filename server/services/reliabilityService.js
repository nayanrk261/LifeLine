const CheckResult = require("../models/CheckResult");

async function calculateAvailability(applicationId, days) {

    const cutoff = new Date();

    cutoff.setDate(cutoff.getDate() - days);

    const results = await CheckResult.find({
        applicationId: applicationId,
        timestamp: { $gte: cutoff }
    });

    if (results.length === 0) {
        return 0;
    }

    const successfulResults = results.filter(result => result.success);

    const availability =
        (successfulResults.length / results.length) * 100;

    return availability;
}

async function calculateErrorRate(applicationId) {

    const results = await CheckResult.find({
        applicationId: applicationId
    });

    if(results.length === 0) {
        return 0;
    }

    const failedResults = results.filter(result => !result.success);

    const errorRate = (failedResults.length/results.length) * 100;

    return errorRate;
}

async function calculateAverageLatency(applicationId) {

    const results = await CheckResult.find({
        applicationId: applicationId
    });

    if(results.length === 0){
        return 0;
    }
    const totalResponseTime = results.reduce(
    (total, result) => total + result.responseTime,
    0
    );

    const average = totalResponseTime / results.length;
    return average;
}

module.exports = { calculateAvailability, calculateErrorRate, calculateAverageLatency };