// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import axios from "axios";
// import { Container, Button, Card, Alert, Form } from "react-bootstrap";
// import "./Quiz.css"; // Import custom CSS for styling

// const GOOGLE_GEMINI_API_KEY = "AIzaSyA2DRxDbZB00mQAgl0IA8TxtuSyGLQB-YA";
// const GOOGLE_GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

// const Quiz = () => {
//   const location = useLocation();
//   const topic = location.state?.topic || "general";
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [score, setScore] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [quizCompleted, setQuizCompleted] = useState(false); // Track if the quiz is completed
//   const [userAnswers, setUserAnswers] = useState([]); // Track user's answers for final evaluation

//   useEffect(() => {
//     const fetchQuiz = async () => {
//       try {
//         const response = await axios.post(
//           `${GOOGLE_GEMINI_API_URL}?key=${GOOGLE_GEMINI_API_KEY}`,
//           {
//             contents: [
//               {
//                 parts: [
//                   {
//                     text: `Generate a multiple-choice quiz on ${topic} with 5 questions. Each question should have four answer choices and indicate the correct answer. Format the response as a JSON array of objects, where each object has the following structure:
//                     {
//                       "question": "Question text",
//                       "answers": ["Answer 1", "Answer 2", "Answer 3", "Answer 4"],
//                       "correctAnswer": "Correct answer text"
//                     }`,
//                   },
//                 ],
//               },
//             ],
//           }
//         );

//         console.log("API Response:", response.data);

//         const quizData = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
//         if (quizData) {
//           try {
//             // Remove the Markdown code block syntax (```json```)
//             const jsonString = quizData.replace(/```json/g, "").replace(/```/g, "").trim();
            
//             // Parse the JSON string into an array of quiz questions
//             const parsedQuestions = JSON.parse(jsonString);
            
//             // Set the parsed questions in the state
//             setQuestions(parsedQuestions);
//           } catch (error) {
//             console.error("Error parsing quiz data:", error);
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching quiz questions:", error);
//         if (error.response) {
//           console.error("API Response Error:", error.response.data);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuiz();
//   }, [topic]);

//   const handleAnswerClick = (answer) => {
//     setSelectedAnswer(answer);

//     // Check if the selected answer is correct
//     const isCorrect = answer === questions[currentQuestion].correctAnswer;

//     // Update the userAnswers array
//     setUserAnswers((prevAnswers) => {
//       // Check if an answer for the current question already exists
//       const existingAnswerIndex = prevAnswers.findIndex(
//         (ans) => ans.question === questions[currentQuestion].question
//       );

//       if (existingAnswerIndex !== -1) {
//         // If an answer exists, update it
//         const updatedAnswers = [...prevAnswers];
//         updatedAnswers[existingAnswerIndex] = {
//           question: questions[currentQuestion].question,
//           selectedAnswer: answer,
//           correctAnswer: questions[currentQuestion].correctAnswer,
//         };
//         return updatedAnswers;
//       } else {
//         // If no answer exists, add a new one
//         return [
//           ...prevAnswers,
//           {
//             question: questions[currentQuestion].question,
//             selectedAnswer: answer,
//             correctAnswer: questions[currentQuestion].correctAnswer,
//           },
//         ];
//       }
//     });

//     // Update the score if the answer is correct
//     if (isCorrect) {
//       setScore((prevScore) => prevScore + 1);
//     }
//   };

//   const handleNextQuestion = () => {
//     if (currentQuestion < questions.length - 1) {
//       setCurrentQuestion(currentQuestion + 1);
//       setSelectedAnswer(null);
//     } else {
//       // Quiz is completed
//       setQuizCompleted(true);
//     }
//   };

//   if (loading) return <p>Loading quiz...</p>;

//   if (quizCompleted) {
//     return (
//       <Container className="mt-5">
//         <h2>Quiz Completed!</h2>
//         <Alert variant="success">
//           <h4>Your Score: {score} / {questions.length}</h4>
//         </Alert>
//         <h3>Review Your Answers:</h3>
//         {userAnswers.map((answer, index) => (
//           <Card key={index} className="mb-3">
//             <Card.Body>
//               <h5>{answer.question}</h5>
//               <p><strong>Your Answer:</strong> {answer.selectedAnswer}</p>
//               <p><strong>Correct Answer:</strong> {answer.correctAnswer}</p>
//               <p>
//                 {answer.selectedAnswer === answer.correctAnswer ? (
//                   <span style={{ color: "green" }}>Correct</span>
//                 ) : (
//                   <span style={{ color: "red" }}>Incorrect</span>
//                 )}
//               </p>
//             </Card.Body>
//           </Card>
//         ))}
//       </Container>
//     );
//   }

//   return (
//     <Container className="mt-5 quiz-container">
//       <h2>Quiz on {topic}</h2>
//       {questions.length > 0 ? (
//         <Card className="p-4 quiz-card">
//           <h5 className="quiz-question">{questions[currentQuestion].question}</h5>
//           <Form>
//             {questions[currentQuestion].answers.map((answer, index) => (
//               <Form.Check
//                 key={index}
//                 type="radio"
//                 id={`answer-${index}`}
//                 label={answer}
//                 name="quiz-answer"
//                 checked={selectedAnswer === answer}
//                 onChange={() => handleAnswerClick(answer)}
//                 className="quiz-option"
//               />
//             ))}
//           </Form>
//           {selectedAnswer && (
//             <div className="d-flex justify-content-end">
//               <Button className="mt-3 quiz-next-button" variant="success" onClick={handleNextQuestion}>
//                 {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
//               </Button>
//             </div>
//           )}
//         </Card>
//       ) : (
//         <p>No questions available.</p>
//       )}
//     </Container>
//   );
// };

// export default Quiz;

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Button, Card, Alert, Form, ProgressBar } from "react-bootstrap";
import "./Quiz.css";

const GOOGLE_GEMINI_API_KEY = "AIzaSyA2DRxDbZB00mQAgl0IA8TxtuSyGLQB-YA";
const GOOGLE_GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const Quiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizData, courseId, sectionIndex, stepIndex, topic } = location.state || {};
  
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setError(null);
  
        // Check if quizData exists and has questions
        if (quizData && Array.isArray(quizData) && quizData.length > 0) {
          console.log("Using provided quizData:", quizData);
          setQuestions(quizData);
          setLoading(false);
          return;
        }
  
        // If quizData is not available, fetch from Gemini API
        if (!topic) {
          setError("No topic provided for the quiz.");
          setLoading(false);
          return;
        }
  
        console.log("Fetching quiz questions from Gemini API...");
        const response = await axios.post(
          `${GOOGLE_GEMINI_API_URL}?key=${GOOGLE_GEMINI_API_KEY}`,
          {
            contents: [
              {
                parts: [
                  {
                    text: `Generate a multiple-choice quiz on ${topic} with 5 questions. 
                    Each question should have four answer choices and indicate the correct answer. 
                    Format the response as a JSON array of objects, where each object has:
                    {
                      "question": "Question text",
                      "options": ["Answer 1", "Answer 2", "Answer 3", "Answer 4"],
                      "correctAnswer": "Correct answer text"
                    }`,
                  },
                ],
              },
            ],
          }
        );
  
        const quizDataString = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  
        if (quizDataString) {
          try {
            const jsonString = quizDataString.replace(/```json/g, "").replace(/```/g, "").trim();
            const parsedQuestions = JSON.parse(jsonString);
            setQuestions(parsedQuestions);
          } catch (error) {
            console.error("Error parsing quiz data:", error);
            setError("Failed to parse quiz questions. Please try again.");
          }
        } else {
          setError("No quiz questions were generated. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching quiz questions:", error);
        setError("Failed to load quiz. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  
    // Call fetchQuiz only if quizData or topic is available
    if (quizData || topic) {
      fetchQuiz();
    } else {
      setError("No quiz data or topic found.");
      setLoading(false);
    }
  }, [topic, quizData]);
  

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = async () => {
    // Record the answer before moving to next question
    const newAnswer = {
      question: questions[currentQuestion].question,
      selectedAnswer: selectedAnswer,
      correctAnswer: questions[currentQuestion].correctAnswer,
      isCorrect: selectedAnswer === questions[currentQuestion].correctAnswer
    };

    setUserAnswers([...userAnswers, newAnswer]);

    if (newAnswer.isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      // Quiz is completed
      setQuizCompleted(true);
      
      // If this quiz is part of a course pathway, mark it as completed
      if (courseId && sectionIndex !== undefined && stepIndex !== undefined) {
        try {
          const token = localStorage.getItem("token");
          await axios.post(
            `http://localhost:5000/api/courses/${courseId}/complete-step`,
            { sectionIndex, stepIndex, quizScore: score },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
          );
        } catch (error) {
          console.error("Failed to update course progress:", error);
        }
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizCompleted(false);
    setUserAnswers([]);
  };

  const handleReturnToPathway = () => {
    navigate(`/courses/${courseId}`);
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Generating your quiz...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <h4>Error Loading Quiz</h4>
          <p>{error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Alert>
      </Container>
    );
  }

  if (quizCompleted) {
    return (
      <Container className="mt-5 quiz-completed-container">
        <Card className="p-4">
          <h2 className="text-center mb-4">Quiz Completed!</h2>
          
          <div className="text-center mb-4">
            <ProgressBar 
              now={(score / questions.length) * 100} 
              label={`${score}/${questions.length}`} 
              variant={score === questions.length ? "success" : score > questions.length/2 ? "info" : "danger"}
              className="mx-auto" 
              style={{ height: "30px", width: "80%" }}
            />
            <h4 className="mt-2">
              Score: {score} out of {questions.length} (
              {Math.round((score / questions.length) * 100)}%)
            </h4>
          </div>

          <h3 className="mb-3">Answer Review:</h3>
          {userAnswers.map((answer, index) => (
            <Card key={index} className={`mb-3 ${answer.isCorrect ? "border-success" : "border-danger"}`}>
              <Card.Body>
                <h5>Question {index + 1}: {answer.question}</h5>
                <p className={answer.isCorrect ? "text-success" : "text-danger"}>
                  <strong>Your Answer:</strong> {answer.selectedAnswer}
                </p>
                {!answer.isCorrect && (
                  <p className="text-success">
                    <strong>Correct Answer:</strong> {answer.correctAnswer}
                  </p>
                )}
              </Card.Body>
            </Card>
          ))}

          <div className="d-flex justify-content-between mt-4">
            <Button variant="secondary" onClick={handleRestartQuiz}>
              Retake Quiz
            </Button>
            {courseId ? (
              <Button variant="primary" onClick={handleReturnToPathway}>
                Return to Learning Pathway
              </Button>
            ) : (
              <Button variant="primary" onClick={() => navigate("/")}>
                Return to Dashboard
              </Button>
            )}
          </div>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="mt-5 quiz-container">
      {questions.length > 0 ? (
        <Card className="p-4 quiz-card">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="quiz-topic">Quiz: {topic}</h2>
            <span className="badge bg-primary">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>

          <Card.Body>
            <h4 className="quiz-question mb-4">
              {questions[currentQuestion].question}
            </h4>

            <Form>
              {questions[currentQuestion].options.map((option, index) => (
                <div key={index} className="mb-2">
                  <Button
                    variant={selectedAnswer === option ? "primary" : "outline-primary"}
                    className={`w-100 text-start quiz-option ${selectedAnswer === option ? "active" : ""}`}
                    onClick={() => handleAnswerClick(option)}
                  >
                    {String.fromCharCode(65 + index)}. {option}
                  </Button>
                </div>
              ))}
            </Form>

            {selectedAnswer && (
              <div className="d-flex justify-content-end mt-4">
                <Button 
                  variant="success" 
                  onClick={handleNextQuestion}
                  className="quiz-next-button"
                >
                  {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      ) : (
        <Alert variant="warning">
          <h4>No Questions Available</h4>
          <p>We couldn't generate any quiz questions for this topic.</p>
          <Button variant="primary" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Alert>
      )}
    </Container>
  );
};

export default Quiz;