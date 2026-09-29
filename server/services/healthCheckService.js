async function checkApplication(url) {
    const startTime = Date.now();
    const controller = new AbortController();

    setTimeout(() => {
    controller.abort();
    }, 5000);

    try{
    const response = await fetch(url, {
    signal: controller.signal
    });

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    const statusCode = response.status;

    const success = response.ok;

    return{
        success,
        statusCode, 
        responseTime,
        error: null
    }
    }
    catch(error) {
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        console.log(error.name);
        console.log(error.message);

        return{
            success : false,
            statusCode : null,
            responseTime,
            error : error.message
        }
    }

}

module.exports = { checkApplication };