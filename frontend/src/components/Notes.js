import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Button, Card, Alert } from "react-bootstrap";
import "./Notes.css";

const GOOGLE_GEMINI_API_KEY = "AIzaSyA2DRxDbZB00mQAgl0IA8TxtuSyGLQB-YA";
const GOOGLE_GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const Notes = () => {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { topic, returnPath } = location.state || {};

  useEffect(() => {
    if (!topic) {
      setError("No topic provided");
      setLoading(false);
      return;
    }

    const generateNotes = async () => {
      try {
        setLoading(true);
        setError("");
        
        const response = await fetch(
          `${GOOGLE_GEMINI_API_URL}?key=${GOOGLE_GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `Generate comprehensive study notes about ${topic} for a computer science student. 
                      Include key concepts, definitions, examples, and code snippets where applicable. 
                      Format the response in Markdown with proper headings, bullet points, and code blocks.
                      Structure should include:
                      - Introduction
                      - Key Concepts
                      - Examples
                      - Best Practices
                      - Common Pitfalls
                      - Summary`
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        const generatedNotes = data.candidates?.[0]?.content?.parts?.[0]?.text || "No notes were generated.";
        
        // Clean up the response if it's wrapped in markdown code blocks
        const cleanedNotes = generatedNotes.replace(/```markdown/g, '').replace(/```/g, '').trim();
        setNotes(cleanedNotes);
      } catch (error) {
        console.error("Error generating notes:", error);
        setError(`Failed to generate notes: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    generateNotes();
  }, [topic]);

  const handleBack = () => {
    navigate(returnPath || "/");
  };

  if (loading) {
    return (
      <div className="notes-container">
        <Card className="notes-loading-card">
          <div className="notes-spinner"></div>
          <h4>Generating notes about: {topic}</h4>
          <p>This may take a moment...</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notes-container">
        <Card className="notes-error-card">
          <h3>Error Generating Notes</h3>
          <Alert variant="danger">{error}</Alert>
          <Button 
            variant="primary" 
            onClick={() => window.location.reload()}
            className="notes-retry-button"
          >
            Try Again
          </Button>
          <Button 
            variant="secondary" 
            onClick={handleBack}
            className="notes-back-button"
          >
            Back to Course
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="notes-container">
      <Card className="notes-content-card">
        <div className="notes-header">
          <h2>Notes: {topic}</h2>
          <Button 
            variant="outline-secondary" 
            onClick={handleBack}
            className="notes-back-button"
          >
            Back to Course
          </Button>
        </div>
        
        <Card.Body className="notes-markdown-content">
          <ReactMarkdown>{notes}</ReactMarkdown>
        </Card.Body>
        
        <div className="notes-footer">
          <Button 
            variant="primary" 
            onClick={handleBack}
            className="notes-back-button"
          >
            Back to Course
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Notes;