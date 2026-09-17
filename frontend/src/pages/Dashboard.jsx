import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

function Dashboard() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [bulletPoint, setBulletPoint] = useState("");
  const [improvedBullet, setImprovedBullet] = useState("");
  const [improvingBullet, setImprovingBullet] = useState(false);
  const [history, setHistory] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const analysisRef = useRef(null);
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const [resumeId, setResumeId] = useState(null);

  const [jobDescription, setJobDescription] = useState("");
  const [jobMatch, setJobMatch] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [matching, setMatching] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError("");
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/users/resumes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setHistory(data.resumes);
        }
      } catch (error) {
        console.error("Failed to fetch resume history");
      }
    };

    fetchHistory();
  }, []);

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a resume first.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login again.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/users/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Resume upload failed.");
        return;
      }

      setAnalysis(data.analysis);
      setAiAnalysis(data.aiAnalysis);
      setHistory((previousHistory) => [
        {
          _id: data.resumeId,
          filename: file.name,
          atsScore: data.analysis.atsScore,
          createdAt: new Date().toISOString(),
        },
        ...previousHistory,
      ]);
      setResumeId(data.resumeId);
      setJobMatch(null);
    } catch (error) {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleImproveBullet = async () => {
    if (!bulletPoint.trim()) {
      return;
    }

    try {
      setImprovingBullet(true);
      setImprovedBullet("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/users/improve-bullet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bulletPoint: bulletPoint.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to improve bullet point");
      }

      setImprovedBullet(data.improvedBullet);
    } catch (error) {
      console.error("Bullet improvement failed:", error.message);
      setImprovedBullet("");
    } finally {
      setImprovingBullet(false);
    }
  };

  const handleJobMatch = async () => {
    if (!resumeId) {
      setError("Please upload your resume first.");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please enter a job description.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login again.");
      return;
    }

    setMatching(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/users/match-job`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          resumeId,
          jobDescription,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Job matching failed.");
        return;
      }

      setJobMatch(data);
    } catch (error) {
      setError("Unable to connect to the server.");
    } finally {
      setMatching(false);
    }
  };

  const handleViewAnalysis = async (resumeId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login again.");
      return;
    }

    setError("");

    try {
      const response = await fetch(`${API_URL}/api/users/resumes/${resumeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load resume analysis.");
        return;
      }

      const resume = data.resume;

      setAnalysis({
        atsScore: resume.atsScore,
        totalSkills: resume.skills.length,
        skills: resume.skills,
        matchedSkills: resume.matchedSkills,
        missingSkills: resume.missingSkills,
        suggestions: resume.suggestions,
      });

      if (resume.matchPercentage > 0) {
        setJobMatch({
          matchedSkills: resume.matchedSkills,
          missingSkills: resume.missingSkills,
          matchPercentage: resume.matchPercentage,
        });
      } else {
        setJobMatch(null);
      }

      setSelectedResumeId(resumeId);

      setTimeout(() => {
        analysisRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (error) {
      setError("Unable to load resume analysis.");
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>Resume Dashboard</h1>
            <p>
              Analyze your resume and improve your chances of getting
              shortlisted.
            </p>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card upload-card">
            <h2>Analyze Your Resume</h2>

            <p>
              Upload your resume and get an ATS score, skill analysis, and
              improvement suggestions.
            </p>

            <input type="file" accept=".pdf" onChange={handleFileChange} />

            {file && <p className="selected-file">Selected: {file.name}</p>}

            <button
              className="dashboard-btn"
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Upload Resume"}
            </button>
          </div>

          <div className="dashboard-card ats-card">
            <h2>ATS Score</h2>

            <p>Your latest resume score will appear here.</p>

            <div className="ats-score">
              <span>{analysis ? analysis.atsScore : "--"}</span>
              <small>/ 100</small>
            </div>

            {analysis && (
              <>
                <div className="score-label">
                  {analysis.atsScore >= 80
                    ? "Strong Resume"
                    : analysis.atsScore >= 60
                      ? "Good Resume"
                      : "Needs Improvement"}
                </div>

                <div className="score-progress">
                  <div
                    className="score-progress-bar"
                    style={{ width: `${analysis.atsScore}%` }}
                  ></div>
                </div>

                <div className="score-summary">
                  <div>
                    <strong>{analysis.totalSkills}</strong>
                    <span>Skills Detected</span>
                  </div>

                  <div>
                    <strong>✓</strong>
                    <span>Ready for Job Matching</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="dashboard-card">
            <h2>Job Matching</h2>

            <p>Paste a job description to compare it with your resume.</p>

            <textarea
              className="job-description"
              placeholder="Paste the job description here..."
              rows="7"
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
            ></textarea>

            <button
              className="dashboard-btn secondary"
              onClick={handleJobMatch}
              disabled={matching}
            >
              {matching ? "Matching..." : "Match Job"}
            </button>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        {analysis && (
          <div
            ref={analysisRef}
            className={`history-section ${
              selectedResumeId ? "analysis-highlight" : ""
            }`}
          >
            <div className="analysis-heading">
              <h2>Resume Analysis</h2>

              {selectedResumeId && (
                <span className="analysis-loaded">✓ Analysis loaded</span>
              )}
            </div>

            <p className="skills-count">Skills found: {analysis.totalSkills}</p>

            <div className="skills-list">
              {analysis.skills.map((skill) => (
                <span className="skill-badge" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {jobMatch && (
          <div className="history-section">
            <h2>Job Match Result</h2>

            <div className="match-score">
              <span>{jobMatch.matchPercentage}%</span>
              <p>Resume Match</p>
            </div>

            <div className="match-section">
              <h3>Matched Skills</h3>

              <div className="skills-list">
                {jobMatch.matchedSkills.length > 0 ? (
                  jobMatch.matchedSkills.map((skill) => (
                    <span className="skill-badge matched" key={skill}>
                      ✓ {skill}
                    </span>
                  ))
                ) : (
                  <p>No matched skills found.</p>
                )}
              </div>
            </div>

            <div className="match-section">
              <h3>Missing Skills</h3>

              <div className="skills-list">
                {jobMatch.missingSkills.length > 0 ? (
                  jobMatch.missingSkills.map((skill) => (
                    <span className="skill-badge missing" key={skill}>
                      ✕ {skill}
                    </span>
                  ))
                ) : (
                  <p>No missing skills.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {analysis && (
          <div className="history-section">
            <h2>Smart Suggestions</h2>

            {analysis.suggestions.length > 0 ? (
              <div className="suggestions-list">
                {analysis.suggestions.map((suggestion, index) => (
                  <div className="suggestion-item" key={index}>
                    <span>💡</span>
                    <p>{suggestion}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="suggestion-item">
                <span>✓</span>
                <p>
                  Your resume looks good based on the current checks. Keep
                  refining your achievements and project impact.
                </p>
              </div>
            )}
          </div>
        )}

        <section className="bullet-improver-section">
          <h2>✨ AI Bullet Point Improver</h2>

          <p>
            Improve your resume bullet points with AI and make them more
            professional and impactful.
          </p>

          <textarea
            value={bulletPoint}
            onChange={(e) => setBulletPoint(e.target.value)}
            placeholder="Example: Made a website using React."
            rows="4"
          ></textarea>

          <button
            className="improve-btn"
            onClick={handleImproveBullet}
            disabled={improvingBullet || !bulletPoint.trim()}
          >
            {improvingBullet ? "Improving..." : "Improve with AI"}
          </button>

          {improvedBullet && (
            <div className="improved-bullet">
              <h3>Improved Bullet</h3>
              <p>{improvedBullet}</p>
            </div>
          )}
        </section>

        {aiAnalysis && (
          <section className="ai-feedback-section">
            <h2>🤖 AI Resume Feedback</h2>

            <div className="ai-feedback-grid">
              <div className="ai-feedback-card">
                <h3>💪 Strengths</h3>

                <ul>
                  {aiAnalysis.strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>

              <div className="ai-feedback-card">
                <h3>⚠️ Areas to Improve</h3>

                <ul>
                  {aiAnalysis.weaknesses.map((weakness, index) => (
                    <li key={index}>{weakness}</li>
                  ))}
                </ul>
              </div>

              <div className="ai-feedback-card">
                <h3>💡 AI Suggestions</h3>

                <ul>
                  {aiAnalysis.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        <div className="history-section">
          <button
            className="history-header"
            onClick={() => setShowHistory(!showHistory)}
          >
            <span>Resume History</span>

            <span className="history-arrow">{showHistory ? "▲" : "▼"}</span>
          </button>

          {!showHistory && (
            <p className="history-hint">
              Click to view your previous resume analyses.
            </p>
          )}

          {showHistory && (
            <div className="history-list">
              {history.length === 0 ? (
                <p>No resume analyses yet.</p>
              ) : (
                history.map((resume) => (
                  <div className="history-item" key={resume._id}>
                    <div className="history-info">
                      <h3>{resume.filename}</h3>

                      <p>
                        Uploaded on{" "}
                        {new Date(resume.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="history-details">
                      <div className="history-stat">
                        <span>ATS Score</span>
                        <strong>{resume.atsScore}</strong>
                      </div>

                      <div className="history-stat">
                        <span>Job Match</span>
                        <strong>
                          {resume.matchPercentage > 0
                            ? `${resume.matchPercentage}%`
                            : "--"}
                        </strong>
                      </div>

                      <button
                        className="history-btn"
                        onClick={() => handleViewAnalysis(resume._id)}
                      >
                        View Analysis
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
