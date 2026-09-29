const Application = require("../models/Application");
function isCheckDue(application) {

    if (!application.lastCheckedAt) {
        return true;
    }

    const now = Date.now();

    const prev = application.lastCheckedAt.getTime();

    const elapsed = now - prev;

    const interval = application.checkInterval * 60 * 1000;

    return elapsed >= interval;
}

const cron = require("node-cron");

cron.schedule("* * * * *", async    () => {
    console.log("Scheduler running...");
    const applications = await Application.find({
    status: "active"
    }); 

    for (const application of applications) {
    if (isCheckDue(application)) {
        console.log("Check is due:", application.name);
    }
}
});