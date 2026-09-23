const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

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
    })
});

router.post("/login", async (req, res) => {
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