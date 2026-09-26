const express = require("express");
const mongoose = require("mongoose");
const Application = require("../models/Application");
const authMiddleware = require("../middleware/authMiddleware");
const { body } = require("express-validator");
const validate = require("../middleware/validationMiddleware");

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    [
        body("name").trim().isLength({ min: 2, max: 100 }),
        body("url").isURL(),
        body("repositoryUrl").optional().isURL(),
        body("checkInterval").optional().isInt({ min: 1 })
    ],
    validate,
    async (req, res) => {
    const { name, url, repositoryUrl, checkInterval } = req.body;

    const application = await Application.create({
        name,
        url,
        repositoryUrl,
        checkInterval,
        ownerId: req.user.userId
    });

    res.status(201).json(application);
});

router.get("/", authMiddleware, async (req, res) => {
    const applications = await Application.find({
        ownerId: req.user.userId
    });

    res.json(applications);
});

router.get("/:id", authMiddleware, async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
            message: "Invalid application ID"
        });
    }

    const application = await Application.findOne({
        _id: req.params.id,
        ownerId: req.user.userId
    });

    if (!application) {
        return res.status(404).json({
            message: "Application not found"
        });
    }

    res.json(application);
});

router.patch(
    "/:id",
    authMiddleware,
    [
        body("name").optional().trim().isLength({ min: 2, max: 100 }),
        body("url").optional().isURL(),
        body("repositoryUrl").optional().isURL(),
        body("status").optional().isIn(["active", "inactive"]),
        body("checkInterval").optional().isInt({ min: 1 })
    ],
    validate,
    async (req, res) => {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid application ID"
            });
        }

        const updates = {};
        const allowedFields = ["name", "url", "repositoryUrl", "status", "checkInterval"];
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const application = await Application.findOneAndUpdate(
            {
                _id: req.params.id,
                ownerId: req.user.userId
            },
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.json(application);
    }
);

router.delete("/:id", authMiddleware, async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
            message: "Invalid application ID"
        });
    }

    const application = await Application.findOneAndDelete({
        _id: req.params.id,
        ownerId: req.user.userId
    });

    if (!application) {
        return res.status(404).json({
            message: "Application not found"
        });
    }

    res.json({
        message: "Application deleted successfully"
    });
});

module.exports = router;