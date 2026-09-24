# AI Resume Analyzer

AI Resume Analyzer is a full-stack web application that helps users analyze and improve their resumes. It provides ATS-style scoring, skill extraction, job description matching, resume history, and AI-powered resume feedback and bullet point improvement.

## 🚀 Live Demo

**Live Application:**  
https://ai-resume-analyzer-mocha-gamma.vercel.app/

**GitHub Repository:**  
https://github.com/PrityKumari27/AI-Resume-Analyzer

---

## ✨ Features

- User registration and login
- JWT-based authentication
- Protected dashboard
- PDF resume upload and parsing
- ATS-style resume scoring
- Technical skill extraction
- Job description matching
- Resume match percentage
- Matched and missing skills
- Resume analysis history
- AI-powered resume feedback
- AI-powered bullet point improvement
- MongoDB-based data storage
- Responsive dashboard interface

---

## 🤖 AI Features

### AI Resume Feedback

The application analyzes the uploaded resume and provides:

- Strengths
- Weaknesses
- Practical improvement suggestions

The AI feedback is focused on the actual resume content and avoids inventing skills, achievements, or experience.

### AI Bullet Point Improvement

Users can submit individual resume bullet points and receive improved versions.

The improvement focuses on:

- Strong action verbs
- Clear and concise wording
- Professional resume language
- Preserving the original meaning
- Avoiding invented metrics or achievements

---

## 📊 Resume Analysis

The application performs rule-based resume analysis to generate an ATS-style score.

It analyzes resume content and technical keywords and extracts relevant skills from the uploaded PDF.

The analysis helps users identify areas that can be improved in their resume.

---

## 🎯 Job Description Matching

Users can paste a job description and compare it with their resume.

The system provides:

- Resume match percentage
- Matched skills
- Missing skills
- Improvement suggestions

This helps users understand how closely their resume matches a particular job description.

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- JavaScript
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Multer
- PDF parsing

### AI

- OpenRouter API
- Free AI models
- Ollama for local development and fallback

### Tools & Platforms

- Git
- GitHub
- Postman
- Vercel
- Render
- MongoDB Atlas

---

## 📂 Project Structure

```text
AI-Resume-Analyzer
│
├── backend
│   ├── src
│   │   ├── controllers
│   │   │   ├── userController.js
│   │   │   └── resumeController.js
│   │   │
│   │   ├── middleware
│   │   │   ├── authMiddleware.js
│   │   │   └── uploadMiddleware.js
│   │   │
│   │   ├── models
│   │   │   ├── User.js
│   │   │   └── Resume.js
│   │   │
│   │   ├── routes
│   │   │   └── userRoutes.js
│   │   │
│   │   ├── services
│   │   │   ├── resumeAnalyzer.js
│   │   │   ├── aiResumeAnalyzer.js
│   │   │   └── bulletPointImprover.js
│   │   │
│   │   └── server.js
│   │
│   ├── .gitignore
│   ├── package.json
│   └── package-lock.json
│
├── frontend
│   ├── src
│   │   ├── pages
│   │   │   ├── Register.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── App.css
│   │
│   ├── .gitignore
│   ├── vercel.json
│   ├── package.json
│   └── package-lock.json
│
└── README.md