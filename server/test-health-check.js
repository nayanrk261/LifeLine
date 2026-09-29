const { checkApplication } = require("./services/healthCheckService");

async function test() {
    const result = await checkApplication("https://httpbin.org/status/500");
    console.log(result);
}

test();