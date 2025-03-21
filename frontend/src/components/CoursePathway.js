import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { ProgressBar } from "react-bootstrap";
import { motion } from "framer-motion";
import "./CoursePathway.css";

const CoursePathway = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hoveredStep, setHoveredStep] = useState(null);
  const [progress, setProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      setError("");
      setCourse(null);
      setProgress(0);
      setCompletedSteps(new Set());

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You are not authenticated. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/courses/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        let fetchedCourse = response.data;
        if (Array.isArray(fetchedCourse) && fetchedCourse.length > 0) {
          fetchedCourse = fetchedCourse[0];
        }

        console.log("Fetched course data:", fetchedCourse);

        setCourse(fetchedCourse);
        setProgress(fetchedCourse.progress || 0);

        // Calculate and prefill completed steps based on progress %
        const totalSteps = fetchedCourse.pathway.reduce(
          (acc, section) => acc + section.children.length,
          0
        );
        const prefilledStepsCount = Math.round(
          (fetchedCourse.progress / 100) * totalSteps
        );

        const newCompletedSteps = new Set();
        let stepCounter = 0;
        fetchedCourse.pathway.forEach((section, sectionIndex) => {
          section.children.forEach((_, stepIndex) => {
            if (stepCounter < prefilledStepsCount) {
              newCompletedSteps.add(`${sectionIndex}-${stepIndex}`);
            }
            stepCounter++;
          });
        });

        setCompletedSteps(newCompletedSteps);
      } catch (error) {
        console.error("Error fetching course:", error);
        setError(error.response?.data?.message || "Failed to fetch course.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  // Handle step click for user-controlled coloring
  const handleStepClick = async (sectionIndex, stepIndex) => {
    if (!course) return;
  
    const stepId = `${sectionIndex}-${stepIndex}`;
    const newCompletedSteps = new Set(completedSteps);
  
    // Toggle step completion
    if (newCompletedSteps.has(stepId)) {
      newCompletedSteps.delete(stepId); // Unmark the step
    } else {
      newCompletedSteps.add(stepId); // Mark the step as completed
    }
  
    setCompletedSteps(newCompletedSteps);
  
    // Update progress dynamically
    const totalSteps = course.pathway.reduce(
      (acc, section) => acc + section.children.length,
      0
    );
    const newProgress = ((newCompletedSteps.size / totalSteps) * 100).toFixed(0);
  
    setProgress(newProgress);
  
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/courses/${id}/progress`,
        { progress: newProgress },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Failed to update progress:", error);
      setError("Failed to update progress.");
    }
  };
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!course) return <p>No course found.</p>;

  return (
    <div className="course-container">
      <h2>{course.technology} Learning Pathway</h2>

      {/* Progress Bar */}
      <div className="progress-container">
        <ProgressBar now={progress} label={`${progress}%`} />
      </div>

      {/* Pathway Sections */}
      <div className="pathway">
        {course.pathway.map((section, sectionIndex) => (
          <div key={sectionIndex} className="pathway-section">
            <h3>{section.name}</h3>

            <div className="steps-container">
              {section.children.map((child, stepIndex) => {
                const stepId = `${sectionIndex}-${stepIndex}`;
                const isCompleted = completedSteps.has(stepId);

                return (
                  <motion.div
                    key={stepId}
                    className={`step ${isCompleted ? "completed" : "locked"} ${
                      stepIndex % 2 === 0 ? "left" : "right"
                    }`}
                    onClick={() => handleStepClick(sectionIndex, stepIndex)}
                    onMouseEnter={() => setHoveredStep(stepId)}
                    onMouseLeave={() => setHoveredStep(null)}
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="step-icon">⭐</span>

                    {hoveredStep === stepId && (
                      <motion.div
                        className="tooltip"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <h4>{child.name}</h4>
                        <p>
                          <ReactMarkdown>
                            {child.description || "No description available."}
                          </ReactMarkdown>
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursePathway;



// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { ProgressBar } from "react-bootstrap";
// import { motion } from "framer-motion";
// import CustomModal from "./CustomModal"; // Import the CustomModal component
// import "./CoursePathway.css";
// import ReactMarkdown from "react-markdown"; // Add this line

// const CoursePathway = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [progress, setProgress] = useState(0);
//   const [completedSteps, setCompletedSteps] = useState(new Set());
//   const [selectedStep, setSelectedStep] = useState(null); // State to manage selected step for modal
//   const [showModal, setShowModal] = useState(false); // State to manage modal visibility
//   const [hoveredStep, setHoveredStep] = useState(null); // State to manage hovered step

//   useEffect(() => {
//     const fetchCourse = async () => {
//       setLoading(true);
//       setError("");
//       setCourse(null);
//       setProgress(0);
//       setCompletedSteps(new Set());

//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           setError("You are not authenticated. Please log in.");
//           setLoading(false);
//           return;
//         }

//         const response = await axios.get(
//           `http://localhost:5000/api/courses/${id}`,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//             withCredentials: true,
//           }
//         );

//         let fetchedCourse = response.data;
//         if (Array.isArray(fetchedCourse) && fetchedCourse.length > 0) {
//           fetchedCourse = fetchedCourse[0];
//         }

//         console.log("Fetched course data:", fetchedCourse);

//         setCourse(fetchedCourse);
//         setProgress(fetchedCourse.progress || 0);

//         // Calculate and prefill completed steps based on progress %
//         const totalSteps = fetchedCourse.pathway.reduce(
//           (acc, section) => acc + section.children.length,
//           0
//         );
//         const prefilledStepsCount = Math.round(
//           (fetchedCourse.progress / 100) * totalSteps
//         );

//         const newCompletedSteps = new Set();
//         let stepCounter = 0;
//         fetchedCourse.pathway.forEach((section, sectionIndex) => {
//           section.children.forEach((_, stepIndex) => {
//             if (stepCounter < prefilledStepsCount) {
//               newCompletedSteps.add(`${sectionIndex}-${stepIndex}`);
//             }
//             stepCounter++;
//           });
//         });

//         setCompletedSteps(newCompletedSteps);
//       } catch (error) {
//         console.error("Error fetching course:", error);
//         setError(error.response?.data?.message || "Failed to fetch course.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourse();
//   }, [id]);

//   // Handle step click for user-controlled coloring
//   const handleStepClick = async (sectionIndex, stepIndex) => {
//     if (!course) return;
  
//     const stepId = `${sectionIndex}-${stepIndex}`;
//     const newCompletedSteps = new Set(completedSteps);
  
//     // Toggle step completion
//     if (newCompletedSteps.has(stepId)) {
//       newCompletedSteps.delete(stepId); // Unmark the step
//     } else {
//       newCompletedSteps.add(stepId); // Mark the step as completed
//     }
  
//     setCompletedSteps(newCompletedSteps);
  
//     // Update progress dynamically
//     const totalSteps = course.pathway.reduce(
//       (acc, section) => acc + section.children.length,
//       0
//     );
//     const newProgress = ((newCompletedSteps.size / totalSteps) * 100).toFixed(0);
  
//     setProgress(newProgress);
  
//     try {
//       const token = localStorage.getItem("token");
//       await axios.put(
//         `http://localhost:5000/api/courses/${id}/progress`,
//         { progress: newProgress },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           withCredentials: true,
//         }
//       );
//     } catch (error) {
//       console.error("Failed to update progress:", error);
//       setError("Failed to update progress.");
//     }
//   };

//   // Handle step click to show modal
//   const handleStepModalClick = (sectionIndex, stepIndex) => {
//     const step = course.pathway[sectionIndex].children[stepIndex];
//     setSelectedStep(step);
//     setShowModal(true);
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p className="error">{error}</p>;
//   if (!course) return <p>No course found.</p>;

//   return (
//     <div className="course-container">
//       <h2>{course.technology} Learning Pathway</h2>

//       {/* Progress Bar */}
//       <div className="progress-container">
//         <ProgressBar now={progress} label={`${progress}%`} />
//       </div>

//       {/* Pathway Sections */}
//       <div className="pathway">
//         {course.pathway.map((section, sectionIndex) => (
//           <div key={sectionIndex} className="pathway-section">
//             <h3>{section.name}</h3>

//             <div className="steps-container">
//               {section.children.map((child, stepIndex) => {
//                 const stepId = `${sectionIndex}-${stepIndex}`;
//                 const isCompleted = completedSteps.has(stepId);

//                 return (
//                   <motion.div
//                     key={stepId}
//                     className={`step ${isCompleted ? "completed" : "locked"} ${
//                       stepIndex % 2 === 0 ? "left" : "right"
//                     }`}
//                     onClick={() => handleStepModalClick(sectionIndex, stepIndex)}
//                     onMouseEnter={() => setHoveredStep(stepId)}
//                     onMouseLeave={() => setHoveredStep(null)}
//                     whileHover={{ scale: 1.1 }}
//                   >
//                     <span className="step-icon">⭐</span>

//                     {hoveredStep === stepId && (
//                       <motion.div
//                         className="tooltip"
//                         initial={{ opacity: 0, y: -10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -10 }}
//                       >
//                         <h4>{child.name}</h4>
//                         <p>
//                           <ReactMarkdown>
//                             {child.description || "No description available."}
//                           </ReactMarkdown>
//                         </p>
//                       </motion.div>
//                     )}
//                   </motion.div>
//                 );
//               })}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Modal for step details */}
//       <CustomModal
//         show={showModal}
//         onHide={() => setShowModal(false)}
//         step={selectedStep}
//       />
//     </div>
//   );
// };

// export default CoursePathway;