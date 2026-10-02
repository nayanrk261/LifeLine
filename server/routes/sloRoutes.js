const express = require("express");
const SLO = require("../models/SLO");
const { calculateAvailability } = require("../services/reliabilityService");

const { calculateErrorBudget, checkSLO } = require("../services/sloService");

const router = express.Router();

router.post("/:id/slo", async (req, res) => {

    const applicationId = req.params.id;

    const { metric, target, window } = req.body;

    const slo = await SLO.create({
        applicationId,
        metric,
        target,
        window 
    })

    res.status(201).json(slo);

});

router.get("/:id/slo", async (req, res) => {

    const applicationID = req.params.id;

    const slo = await SLO.findOne({ applicationId: applicationID });

    res.json(slo);
});
 
router.get("/:id/slo/status", async (req, res) => {
    const applicationId = req.params.id;

    const slo = await SLO.findOne({
    applicationId
    });

    const days = parseInt(slo.window);

    const actualAvailability = await calculateAvailability(applicationId, days);
    const errorBudget = calculateErrorBudget(slo.target);
    const sloMet = checkSLO(actualAvailability, slo.target);

    res.json({
    target: slo.target,
    actualAvailability,
    errorBudget,
    sloMet
    });
});

module.exports = router;