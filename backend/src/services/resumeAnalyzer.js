const skillsList = [
  "C++",
  "C",
  "JavaScript",
  "Python",
  "Java",
  "HTML",
  "CSS",
  "React.js",
  "Node.js",
  "Express.js",
  "MongoDB",
  "MySQL",
  "REST APIs",
  "Git",
  "GitHub",
  "Data Structures and Algorithms",
  "OOP",
  "DBMS",
  "Operating Systems",
  "Docker",
];

const hasSkill = (text, skill) => {
  const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const skillRegex = new RegExp(
    `(?<![a-z0-9+#.])${escapedSkill}(?![a-z0-9+#.])`,
    "i",
  );

  return skillRegex.test(text);
};

const analyzeResume = (text, jobDescription = "") => {
  const resumeText = text.toLowerCase();
  const jobText = jobDescription.toLowerCase();

  const foundSkills = [];

  skillsList.forEach((skill) => {
    if (hasSkill(resumeText, skill)) {
      foundSkills.push(skill);
    }
  });

  let score = 0;

  // Skills score
  score += Math.min(foundSkills.length * 2, 40);

  // Resume sections
  if (resumeText.includes("education")) {
    score += 10;
  }

  if (resumeText.includes("project")) {
    score += 10;
  }

  if (resumeText.includes("experience")) {
    score += 10;
  }

  if (resumeText.includes("certification")) {
    score += 5;
  }

  if (resumeText.includes("achievement")) {
    score += 5;
  }

  // Resume content
  if (resumeText.length > 1000) {
    score += 10;
  }

  if (resumeText.length > 2000) {
    score += 10;
  }

  const atsScore = Math.min(score, 100);

  // Job description matching
  const matchedSkills = [];
  const missingSkills = [];

  if (jobDescription.trim()) {
    skillsList.forEach((skill) => {
      if (hasSkill(jobText, skill)) {
        if (hasSkill(resumeText, skill)) {
          matchedSkills.push(skill);
        } else {
          missingSkills.push(skill);
        }
      }
    });
  }

  const totalJobSkills = matchedSkills.length + missingSkills.length;

  const matchPercentage =
    totalJobSkills > 0
      ? Math.round((matchedSkills.length / totalJobSkills) * 100)
      : 0;

  const suggestions = [];

  if (missingSkills.length > 0) {
    suggestions.push(
      `Consider adding relevant skills mentioned in the job description: ${missingSkills.join(", ")}.`,
    );
  }

  if (foundSkills.length < 5) {
    suggestions.push(
      "Try adding more relevant technical skills to your resume.",
    );
  }

  if (!resumeText.includes("project")) {
    suggestions.push("Add projects that demonstrate your technical skills.");
  }

  if (!resumeText.includes("experience")) {
    suggestions.push(
      "Add relevant internship, work, or practical experience if available.",
    );
  }

  if (!resumeText.includes("achievement")) {
    suggestions.push(
      "Include relevant achievements or certifications to strengthen your resume.",
    );
  }

  if (jobDescription.trim() && matchedSkills.length > 0) {
    suggestions.push(
      "Highlight your matched skills in your projects and experience sections.",
    );
  }

  return {
    skills: foundSkills,
    totalSkills: foundSkills.length,
    atsScore,
    matchedSkills,
    missingSkills,
    matchPercentage,
    suggestions,
  };
};

module.exports = {
  analyzeResume,
};
