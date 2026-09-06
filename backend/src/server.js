const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI Resume Analyzer API is running");
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API is working properly",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
