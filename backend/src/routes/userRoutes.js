const express = require("express");

const {
  createUser,
  loginUser,
  getProfile,
} = require("../controllers/userController");

const {
  uploadResume,
  getResumeHistory,
  getResumeById,
  matchJob,
  improveBullet,
} = require("../controllers/resumeController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/", createUser);

router.post("/login", loginUser);

router.get("/profile", protect, getProfile);

router.get("/resumes", protect, getResumeHistory);

router.get("/resumes/:id", protect, getResumeById);

router.post("/upload", protect, upload.single("resume"), uploadResume);

router.post("/match-job", protect, matchJob);
router.post("/improve-bullet", protect, improveBullet);

module.exports = router;
