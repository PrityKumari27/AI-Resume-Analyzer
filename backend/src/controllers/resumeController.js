const fs = require("fs");
const pdfParse = require("pdf-parse");
const { analyzeResume } = require("../services/resumeAnalyzer");
const { analyzeResumeWithAI } = require("../services/aiResumeAnalyzer");
const { improveBulletPoint } = require("../services/bulletPointImprover");
const Resume = require("../models/Resume");

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume",
      });
    }

    const dataBuffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(dataBuffer);

    const jobDescription = req.body.jobDescription || "";
    const analysis = analyzeResume(data.text, jobDescription);

    // AI analysis is optional in production.
    // If Ollama is unavailable, continue with ATS analysis.
    let aiAnalysis = {
      strengths: [],
      weaknesses: [],
      suggestions: [],
    };

    try {
      aiAnalysis = await analyzeResumeWithAI(data.text);
    } catch (error) {
      console.error("AI resume analysis unavailable:", error.message);
    }

    const savedResume = await Resume.create({
      user: req.userId,
      filename: req.file.originalname,
      atsScore: analysis.atsScore,
      skills: analysis.skills,
      matchedSkills: analysis.matchedSkills,
      missingSkills: analysis.missingSkills,
      matchPercentage: analysis.matchPercentage,
      jobDescription: jobDescription,
      suggestions: analysis.suggestions,

      aiStrengths: aiAnalysis.strengths,
      aiWeaknesses: aiAnalysis.weaknesses,
      aiSuggestions: aiAnalysis.suggestions,
    });

    res.status(200).json({
      success: true,
      message: "Resume analyzed successfully",
      resumeId: savedResume._id,
      analysis,
      aiAnalysis,
    });
  } catch (error) {
    console.error("Resume parsing failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to extract resume text",
    });
  } finally {
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
        console.log("Uploaded resume file deleted");
      } catch (deleteError) {
        console.error("Failed to delete uploaded resume:", deleteError.message);
      }
    }
  }
};

const getResumeHistory = async (req, res) => {
  try {
    const resumes = await Resume.find({
      user: req.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      resumes,
    });
  } catch (error) {
    console.error("Failed to fetch resume history:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch resume history",
    });
  }
};

const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error("Failed to fetch resume:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch resume",
    });
  }
};

const matchJob = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;

    if (!resumeId || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: "Resume ID and job description are required",
      });
    }

    const resume = await Resume.findOne({
      _id: resumeId,
      user: req.userId,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const analysis = analyzeResume(resume.skills.join(" "), jobDescription);

    resume.jobDescription = jobDescription;
    resume.matchedSkills = analysis.matchedSkills;
    resume.missingSkills = analysis.missingSkills;
    resume.matchPercentage = analysis.matchPercentage;

    await resume.save();

    res.status(200).json({
      success: true,
      matchedSkills: analysis.matchedSkills,
      missingSkills: analysis.missingSkills,
      matchPercentage: analysis.matchPercentage,
    });
  } catch (error) {
    console.error("Job matching failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to match resume with job description",
    });
  }
};

const improveBullet = async (req, res) => {
  try {
    const { bulletPoint } = req.body;

    if (!bulletPoint || !bulletPoint.trim()) {
      return res.status(400).json({
        success: false,
        message: "Bullet point is required",
      });
    }

    const improvedBullet = await improveBulletPoint(bulletPoint.trim());

    res.status(200).json({
      success: true,
      originalBullet: bulletPoint.trim(),
      improvedBullet,
    });
  } catch (error) {
    console.error("Bullet improvement failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to improve bullet point",
    });
  }
};

module.exports = {
  uploadResume,
  getResumeHistory,
  getResumeById,
  matchJob,
  improveBullet,
};
