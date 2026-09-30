const Application = require("../models/Application");
const { checkApplication } = require("./healthCheckService");
const CheckResult = require("../models/CheckResult");
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
        const result = await checkApplication(application.url);
        const checkResult = await CheckResult.create({
           applicationId: application._id,
           timestamp: new Date(),
           success: result.success,
           statusCode: result.statusCode,
           responseTime: result.responseTime,
           error: result.error
       });
        application.lastCheckedAt = new Date();
        await application.save();
    }
    }
});