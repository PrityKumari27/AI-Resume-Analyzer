const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    filename: {
      type: String,
      required: true,
    },

    atsScore: {
      type: Number,
      required: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    matchedSkills: {
      type: [String],
      default: [],
    },

    missingSkills: {
      type: [String],
      default: [],
    },

    matchPercentage: {
      type: Number,
      default: 0,
    },

    jobDescription: {
      type: String,
      default: "",
    },

    suggestions: {
      type: [String],
      default: [],
    },

    aiStrengths: {
      type: [String],
      default: [],
    },

    aiWeaknesses: {
      type: [String],
      default: [],
    },

    aiSuggestions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;
