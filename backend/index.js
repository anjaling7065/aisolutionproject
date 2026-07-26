const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoute = require("./routes/auth");
const bookCallRoute = require("./routes/bookCall");

const app = express();

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

app.use("/api", authRoute);
app.use("/api/book-call", bookCallRoute);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/aisolution";

// Connect MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server Running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    app.listen(PORT, () => {
      console.log(`🚀 Server Running on port ${PORT} (MongoDB not connected)`);
    });
  });

module.exports = app;