require("dotenv").config();
const connectDB = require("./config/db");
const {
    calculateAvailability,
    calculateErrorRate,
    calculateAverageLatency
} = require("./services/reliabilityService");  

async function test() {
    await connectDB();

    const applicationId = "6abd444c01144005da98dae7";

    const availability = await calculateAvailability(applicationId);
    const errorRate = await calculateErrorRate(applicationId);
    const averageLatency = await calculateAverageLatency(applicationId);

console.log("Availability:", availability);
console.log("Error Rate:", errorRate);
console.log("Average Latency:", averageLatency, "ms");

    console.log("Availability:", availability);
    console.log("Error Rate:", errorRate);
}

test();