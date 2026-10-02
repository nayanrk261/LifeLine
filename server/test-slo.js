const { calculateErrorBudget, checkSLO } = require("./services/sloService");

console.log("Error Budget:", calculateErrorBudget(99.5));

console.log("SLO Met:", checkSLO(99.8, 99.5));
console.log("SLO Met:", checkSLO(99.2, 99.5));