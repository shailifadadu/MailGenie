import { useState } from "react";
import axios from "axios";
import "./EmailReplyGenerator.css";

function EmailReplyGenerator() {
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState("");
  const [generatedReply, setGeneratedReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!emailContent) return;

    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "https://mailgenie-backend.onrender.com/api/email/generate",
        {
          emailContent,
          tone,
        }
      );

      setGeneratedReply(
        typeof response.data === "string"
          ? response.data
          : JSON.stringify(response.data)
      );
    } catch (error) {
      setError("Failed to generate email reply. Please try again");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="email-generator-container">
      <div className="app-header">
        <div className="logo-container">
          <div className="logo-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22 8.608V16.75C22 18.5 20.5 20 18.75 20H5.25C3.5 20 2 18.5 2 16.75V8.608L11.4 14.304C11.7556 14.5111 12.2444 14.5111 12.6 14.304L22 8.608Z"
                fill="currentColor"
              />
              <path
                d="M22 7.25V7.25249C22 7.25166 22 7.25083 22 7.25L12.6 12.946C12.2444 13.1531 11.7556 13.1531 11.4 12.946L2 7.25C2 7.25083 2 7.25166 2 7.25249V7.25C2 5.5 3.5 4 5.25 4H18.75C20.5 4 22 5.5 22 7.25Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h1>MailGenie</h1>
        </div>
        <p className="subtitle">An AI-Powered Email Assistant!</p>
      </div>

      <div className="content-container">
        <div className="input-section">
          <div className="section-header">
            <h2>Original Email</h2>
            <div className="badge">Input</div>
          </div>
          <div className="textarea-container">
            <textarea
              placeholder="Paste the email you received here..."
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
            />
          </div>
          <div className="controls">
            <div className="select-container">
              <label>Tone</label>
              <select value={tone} onChange={(e) => setTone(e.target.value)}>
                <option value="">Select tone (optional)</option>
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="friendly">Friendly</option>
              </select>
            </div>
            <button
              className={`generate-btn ${loading ? "loading" : ""}`}
              onClick={handleSubmit}
              disabled={!emailContent || loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  <span>Generating...</span>
                </>
              ) : (
                "Generate Reply"
              )}
            </button>
          </div>
        </div>

        <div
          className={`output-section ${generatedReply ? "has-content" : ""}`}
        >
          <div className="section-header">
            <h2>Generated Reply</h2>
            <div className="badge output-badge">Output</div>
          </div>
          <div className="textarea-container">
            <textarea
              placeholder="Your AI-generated reply will appear here..."
              value={generatedReply}
              readOnly
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button
            className={`copy-btn ${copied ? "copied" : ""} ${
              !generatedReply ? "disabled" : ""
            }`}
            onClick={copyToClipboard}
            disabled={!generatedReply}
          >
            {copied ? (
              <>
                <svg
                  className="check-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 6L9 17L4 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg
                  className="copy-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z"
                    fill="currentColor"
                  />
                  <path
                    d="M17.1 2H12.9C9.5 2 8.1 3.3 8.03 6.5H11.1C15.5 6.5 17.5 8.5 17.5 12.9V15.97C20.7 15.9 22 14.5 22 11.1V6.9C22 3.4 20.6 2 17.1 2Z"
                    fill="currentColor"
                  />
                </svg>
                Copy to Clipboard
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmailReplyGenerator;
