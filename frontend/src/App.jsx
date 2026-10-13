
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportUrl, setReportUrl] = useState("");
  const [description, setDescription] = useState("");
  const [reportMessage, setReportMessage] = useState("");
  const [reportLoading, setReportLoading] = useState(false);

  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load community reports from the backend
  async function fetchReports() {
    setReportsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/reports");

      if (!response.ok) {
        throw new Error("Could not load reports.");
      }

      const data = await response.json();
      setReports(data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setReportsLoading(false);
    }
  }

  // Load reports when the page opens
  useEffect(() => {
    fetchReports();
  }, []);

  // Check a URL for suspicious patterns
  async function checkUrl(event) {
    event.preventDefault();
    setResult(null);
    setError("");

    if (!url.trim()) {
      setError("Please enter a URL to check.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8080/api/check-url?url=${encodeURIComponent(url)}`
      );

      if (!response.ok) {
        throw new Error("The URL checker could not process your request.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(
        "Could not connect to ScamShield. Make sure your Java backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  // Submit a new community scam report
  async function submitReport(event) {
    event.preventDefault();
    setReportMessage("");

    if (!reportUrl.trim() || !description.trim()) {
      setReportMessage(
        "Please enter both the suspicious URL and description."
      );
      return;
    }

    setReportLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: reportUrl.trim(),
          description: description.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Report submission failed.");
      }

      setReportMessage("Report submitted successfully!");
      setReportUrl("");
      setDescription("");

      // Refresh community reports after submission
      await fetchReports();
    } catch (err) {
      console.error("Error submitting report:", err);
      setReportMessage(
        "Could not submit the report. Check your backend and try again."
      );
    } finally {
      setReportLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#">
          <span className="brand-icon">🛡</span>
          Scam<span>Shield</span>
        </a>
        <span className="nav-tag">SCAM AWARENESS PLATFORM</span>
      </header>

      <main>
        <section className="hero">
          <div className="eyebrow">
            <span className="live-dot"></span>
            YOUR FIRST LINE OF DEFENCE
          </div>

          <h1>
            Don't trust the link.
            <br />
            <span>Check it first.</span>
          </h1>

          <p className="subtitle">
            Analyze suspicious URLs for warning signs before you click.
            A little caution can make a big difference.
          </p>

          <form className="checker" onSubmit={checkUrl}>
            <label htmlFor="url-input">Website URL</label>

            <div className="input-row">
              <span className="link-icon">↗</span>

              <input
                id="url-input"
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
              />

              <button type="submit" disabled={loading}>
                {loading ? "Checking..." : "Check URL →"}
              </button>
            </div>

            <p className="input-hint">
              Enter the full URL, including https://
            </p>
          </form>

          {error && <div className="error-box">{error}</div>}

          {result && (
            <section className="result-card" aria-live="polite">
              <div className="result-heading">
                <div>
                  <p className="result-label">ANALYSIS RESULT</p>
                  <h2>URL risk assessment</h2>
                </div>

                <span
                  className={`risk-badge ${String(
                    result.riskLevel
                  ).toLowerCase()}`}
                >
                  {result.riskLevel} RISK
                </span>
              </div>

              <div className="score-row">
                <div>
                  <span className="score-number">{result.score}</span>
                  <span className="score-out-of"> / 100</span>
                </div>

                <span className="score-caption">
                  Rule-based risk score
                </span>
              </div>

              <div className="score-track">
                <div
                  className={`score-fill ${String(
                    result.riskLevel
                  ).toLowerCase()}`}
                  style={{
                    width: `${Math.max(
                      0,
                      Math.min(100, Number(result.score) || 0)
                    )}%`,
                  }}
                ></div>
              </div>

              <h3>What we found</h3>

              <ul className="warnings">
                {(Array.isArray(result.warnings) && result.warnings.length > 0
                  ? result.warnings
                  : ["No warning details were returned."]
                ).map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>

              <p className="disclaimer">
                This is a basic rule-based assessment, not a guarantee that
                a website is safe or malicious. Be cautious with unfamiliar
                links.
              </p>
            </section>
          )}
        </section>

        {/* Community reports */}
        <section className="community-section">
          <div className="section-heading">
            <p className="eyebrow">COMMUNITY ALERTS</p>
            <h2>Recently reported links.</h2>
            <p className="subtitle">
              Reports shared by the ScamShield community.
            </p>
          </div>

          {reportsLoading && <p>Loading community reports...</p>}

          {!reportsLoading && reports.length === 0 && (
            <p>No reports have been submitted yet.</p>
          )}

          <div className="community-grid">
            {reports.map((report) => (
              <article className="community-card" key={report.id}>
                <span className="community-label">
                  COMMUNITY REPORTED
                </span>

                <h3 className="community-url">{report.url}</h3>
                <p>{report.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Submit a scam report */}
        <section className="report-section">
          <div className="section-heading">
            <p className="eyebrow">HELP PROTECT OTHERS</p>
            <h2>Report a suspicious link.</h2>
            <p className="subtitle">
              Found a suspicious website? Share it with the ScamShield
              community.
            </p>
          </div>

          <form className="report-form" onSubmit={submitReport}>
            <label htmlFor="report-url">Suspicious website URL</label>

            <input
              id="report-url"
              type="url"
              placeholder="https://suspicious-example.com"
              value={reportUrl}
              onChange={(event) => setReportUrl(event.target.value)}
              required
            />

            <label htmlFor="report-description">
              Why does it seem suspicious?
            </label>

            <textarea
              id="report-description"
              placeholder="Describe the suspicious message, offer, or activity..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              required
            />

            <button type="submit" disabled={reportLoading}>
              {reportLoading ? "Submitting..." : "Submit Scam Report →"}
            </button>

            {reportMessage && (
              <p className="report-message" aria-live="polite">
                {reportMessage}
              </p>
            )}
          </form>
        </section>

        {/* Features */}
        <section className="features">
          <div className="section-heading">
            <p className="eyebrow">BUILT FOR SAFER BROWSING</p>
            <h2>Think before you click.</h2>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <span className="feature-icon">⌕</span>
              <h3>URL analysis</h3>
              <p>
                Check links for suspicious patterns using simple rules.
              </p>
            </article>

            <article className="feature-card">
              <span className="feature-icon">⚑</span>
              <h3>Spot warning signs</h3>
              <p>
                See which URL patterns triggered the risk assessment.
              </p>
            </article>

            <article className="feature-card">
              <span className="feature-icon">◈</span>
              <h3>Awareness first</h3>
              <p>
                Learn to approach unexpected links with more caution.
              </p>
            </article>
          </div>
        </section>
      </main>

      <footer>
        <a className="brand footer-brand" href="#">
          🛡 Scam<span>Shield</span>
        </a>

        <p>Built to encourage safer digital habits.</p>

        <p className="footer-note">
          A low-risk result does not guarantee a safe website.
        </p>
      </footer>
    </div>
  );
}

export default App;

