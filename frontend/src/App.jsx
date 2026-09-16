import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./pages/ProtectedRoute";

function Home() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">
          Resume<span>AI</span>
        </div>

        <div className="nav-buttons">
          <Link to="/login" className="nav-btn">
            Login
          </Link>

          <Link to="/register" className="nav-btn primary">
            Get Started
          </Link>
        </div>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-badge">AI-Powered Resume Analysis</div>

          <h1>
            Make Your Resume
            <br />
            <span>Job Ready</span>
          </h1>

          <p>
            Analyze your resume, check your ATS score, match it with job
            descriptions, and get practical suggestions to improve your chances
            of getting shortlisted.
          </p>

          <Link to="/register" className="start-btn">
            Analyze My Resume
          </Link>

          <div className="hero-note">
            ✓ ATS Score &nbsp;&nbsp; ✓ Job Matching &nbsp;&nbsp; ✓ Smart
            Suggestions
          </div>
        </section>

        <section className="features">
          <div className="feature-card">
            <div className="feature-icon">01</div>

            <h3>ATS Score</h3>

            <p>
              Understand how well your resume is optimized for applicant
              tracking systems.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">02</div>

            <h3>Job Matching</h3>

            <p>
              Compare your resume with a job description and discover matched
              and missing skills.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">03</div>

            <h3>Smart Suggestions</h3>

            <p>
              Get practical suggestions to improve your resume for the role you
              are targeting.
            </p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>© 2026 ResumeAI. Built to help you build a better resume.</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
