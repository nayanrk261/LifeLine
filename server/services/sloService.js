function calculateErrorBudget(target) {
    const errorBudget = 100 - target;
    return errorBudget;
}

function checkSLO(actualValue, target) {
    if (actualValue >= target) {
        return true; // SLO is met
    } else {
        return false; // SLO is not met
    }
}

module.exports = { calculateErrorBudget, checkSLO };