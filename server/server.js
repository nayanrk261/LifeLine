require("dotenv").config();
require("./services/schedulerService");

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const errorHandler = require("./middleware/errorMiddleware");
const reliabilityRoutes = require("./routes/reliabilityRoutes");
const sloRoutes = require("./routes/sloRoutes");
const incidentRoutes = require("./routes/incidentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
    res.json({ message: "Lifeline backend is running" });
});

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "Lifeline API is working"
    });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/reliability", reliabilityRoutes);
app.use("/api/applications", sloRoutes);
app.use("/api/incidents", incidentRoutes);

// Error handler — MUST be after routes
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Lifeline server running on port ${PORT}`);
});