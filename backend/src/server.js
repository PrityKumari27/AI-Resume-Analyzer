const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing from .env");
  process.exit(1);
}

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);

app.use((error, req, res, next) => {
  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "File size must be less than 5 MB.",
    });
  }

  if (error.message === "Only PDF files are allowed.") {
    return res.status(400).json({
      success: false,
      message: "Only PDF files are allowed.",
    });
  }

  console.error("Server error:", error.message);

  res.status(500).json({
    success: false,
    message: "Something went wrong. Please try again.",
  });
});

app.get("/", (req, res) => {
  res.send("AI Resume Analyzer API is running");
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API is working properly",
  });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });
