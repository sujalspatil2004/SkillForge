import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Container, Button, Card, Alert, Form } from "react-bootstrap";
import "./Quiz.css"; // Import custom CSS for styling

const GOOGLE_GEMINI_API_KEY = "AIzaSyA2DRxDbZB00mQAgl0IA8TxtuSyGLQB-YA";
const GOOGLE_GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const Quiz = () => {
  const location = useLocation();
  const topic = location.state?.topic || "general";
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false); // Track if the quiz is completed
  const [userAnswers, setUserAnswers] = useState([]); // Track user's answers for final evaluation

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.post(
          `${GOOGLE_GEMINI_API_URL}?key=${GOOGLE_GEMINI_API_KEY}`,
          {
            contents: [
              {
                parts: [
                  {
                    text: `Generate a multiple-choice quiz on ${topic} with 5 questions. Each question should have four answer choices and indicate the correct answer. Format the response as a JSON array of objects, where each object has the following structure:
                    {
                      "question": "Question text",
                      "answers": ["Answer 1", "Answer 2", "Answer 3", "Answer 4"],
                      "correctAnswer": "Correct answer text"
                    }`,
                  },
                ],
              },
            ],
          }
        );

        console.log("API Response:", response.data);

        const quizData = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (quizData) {
          try {
            // Remove the Markdown code block syntax (```json```)
            const jsonString = quizData.replace(/```json/g, "").replace(/```/g, "").trim();
            
            // Parse the JSON string into an array of quiz questions
            const parsedQuestions = JSON.parse(jsonString);
            
            // Set the parsed questions in the state
            setQuestions(parsedQuestions);
          } catch (error) {
            console.error("Error parsing quiz data:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching quiz questions:", error);
        if (error.response) {
          console.error("API Response Error:", error.response.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [topic]);

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);

    // Check if the selected answer is correct
    const isCorrect = answer === questions[currentQuestion].correctAnswer;

    // Update the userAnswers array
    setUserAnswers((prevAnswers) => {
      // Check if an answer for the current question already exists
      const existingAnswerIndex = prevAnswers.findIndex(
        (ans) => ans.question === questions[currentQuestion].question
      );

      if (existingAnswerIndex !== -1) {
        // If an answer exists, update it
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[existingAnswerIndex] = {
          question: questions[currentQuestion].question,
          selectedAnswer: answer,
          correctAnswer: questions[currentQuestion].correctAnswer,
        };
        return updatedAnswers;
      } else {
        // If no answer exists, add a new one
        return [
          ...prevAnswers,
          {
            question: questions[currentQuestion].question,
            selectedAnswer: answer,
            correctAnswer: questions[currentQuestion].correctAnswer,
          },
        ];
      }
    });

    // Update the score if the answer is correct
    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      // Quiz is completed
      setQuizCompleted(true);
    }
  };

  if (loading) return <p>Loading quiz...</p>;

  if (quizCompleted) {
    return (
      <Container className="mt-5">
        <h2>Quiz Completed!</h2>
        <Alert variant="success">
          <h4>Your Score: {score} / {questions.length}</h4>
        </Alert>
        <h3>Review Your Answers:</h3>
        {userAnswers.map((answer, index) => (
          <Card key={index} className="mb-3">
            <Card.Body>
              <h5>{answer.question}</h5>
              <p><strong>Your Answer:</strong> {answer.selectedAnswer}</p>
              <p><strong>Correct Answer:</strong> {answer.correctAnswer}</p>
              <p>
                {answer.selectedAnswer === answer.correctAnswer ? (
                  <span style={{ color: "green" }}>Correct</span>
                ) : (
                  <span style={{ color: "red" }}>Incorrect</span>
                )}
              </p>
            </Card.Body>
          </Card>
        ))}
      </Container>
    );
  }

  return (
    <Container className="mt-5 quiz-container">
      <h2>Quiz on {topic}</h2>
      {questions.length > 0 ? (
        <Card className="p-4 quiz-card">
          <h5 className="quiz-question">{questions[currentQuestion].question}</h5>
          <Form>
            {questions[currentQuestion].answers.map((answer, index) => (
              <Form.Check
                key={index}
                type="radio"
                id={`answer-${index}`}
                label={answer}
                name="quiz-answer"
                checked={selectedAnswer === answer}
                onChange={() => handleAnswerClick(answer)}
                className="quiz-option"
              />
            ))}
          </Form>
          {selectedAnswer && (
            <div className="d-flex justify-content-end">
              <Button className="mt-3 quiz-next-button" variant="success" onClick={handleNextQuestion}>
                {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
              </Button>
            </div>
          )}
        </Card>
      ) : (
        <p>No questions available.</p>
      )}
    </Container>
  );
};

export default Quiz;