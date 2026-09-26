const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
const { body } = require("express-validator");
const validate = require("../middleware/validationMiddleware");

const router = express.Router();

router.post(
    "/register",
    [
        body("name").trim().isLength({ min: 3, max: 50 }),
        body("email").isEmail().normalizeEmail(),
        body("password").isLength({ min: 6 })
    ],
    validate,
    async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).json({
            message: "Email already registered"
        });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    try {
        const user = await User.create({
            name,
            email,
            passwordHash
        });

        res.json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }
        throw error;
    }
});

router.post(
    "/login",
    [
        body("email").isEmail().normalizeEmail(),
        body("password").isLength({ min: 6 })
    ],
    validate,
    async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    const token = jwt.sign(
        {userId: user._id},
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.json({
        message: "Login successful",
        token
    });
});

router.get("/me", authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.userId).select("-passwordHash");

    res.json(user);
});

module.exports = router;