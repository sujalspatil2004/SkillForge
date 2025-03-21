import React from "react";
import { Modal, Button } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";

const CustomModal = ({ show, onHide, step }) => {
  const navigate = useNavigate();

  if (!step) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{step.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ReactMarkdown>{step.description || "No description available."}</ReactMarkdown>
        <div className="d-flex justify-content-between mt-3">
          <Button variant="primary" href={`https://www.youtube.com/results?search_query=${step.name}`} target="_blank">
            Learn on YouTube
          </Button>
          <Button variant="success" href={`https://www.geeksforgeeks.org/?s=${step.name}`} target="_blank">
            Learn on GFG
          </Button>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="warning" onClick={() => navigate("/quiz", { state: { topic: step.name } })}>
          Start Quiz
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomModal;