require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

connectDB();

app.get("/", (req, res) => {
  res.json({
    message: "Lifeline backend is running"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Lifeline API is working"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Lifeline server running on port ${PORT}`);
});