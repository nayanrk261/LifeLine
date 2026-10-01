const express = require("express");
const {calculateAvailability, calculateErrorRate, calculateAverageLatency} = require("../services/reliabilityService");

const router = express.Router();

router.get("/:id/metrics",async (req,res) => {
    const applicationId = req.params.id;
    
    const availability = await calculateAvailability(applicationId);
    const errorRate = await calculateErrorRate(applicationId);
    const averageLatency = await calculateAverageLatency(applicationId);

    res.json({
        availability,
        errorRate,
        averageLatency
    })
})

module.exports = router;