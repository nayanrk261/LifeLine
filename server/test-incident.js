const { createIncidentEvent } = require("./services/incidentEventService");

require("dotenv").config();
const connectDB = require("./config/db");

async function test() {
    await connectDB();

    const event = await createIncidentEvent(
        "6ac0c9503f09ef4f579b4c1a",
        "recovery",
        "Application recovered successfully"
    );

    console.log("Event created:", event);

    process.exit();
}

test();