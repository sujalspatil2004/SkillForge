
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { ProgressBar } from "react-bootstrap";
import "./CoursePathway.css";

const CoursePathway = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

        setCourse(fetchedCourse);
        setProgress(fetchedCourse.progress || 0);

        if (fetchedCourse.pathway) {
          const totalSteps = fetchedCourse.pathway.reduce(
            (acc, section) => acc + section.children.length,
            0
          );
          const completedCount = Math.round((fetchedCourse.progress / 100) * totalSteps);
          
          const newCompletedSteps = new Set();
          let stepsProcessed = 0;
          
          fetchedCourse.pathway.forEach((section, sectionIndex) => {
            section.children.forEach((_, stepIndex) => {
              if (stepsProcessed < completedCount) {
                newCompletedSteps.add(`${sectionIndex}-${stepIndex}`);
                stepsProcessed++;
              }
            });
          });

          setCompletedSteps(newCompletedSteps);
        }
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch course.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleStepClick = async (sectionIndex, stepIndex) => {
    if (!course) return;

    try {
      const stepId = `${sectionIndex}-${stepIndex}`;
      const newCompletedSteps = new Set(completedSteps);

      if (newCompletedSteps.has(stepId)) {
        newCompletedSteps.delete(stepId);
      } else {
        newCompletedSteps.add(stepId);
      }

      const totalSteps = course.pathway.reduce(
        (acc, section) => acc + section.children.length,
        0
      );
      const newProgress = Math.round((newCompletedSteps.size / totalSteps) * 100);

      setCompletedSteps(newCompletedSteps);
      setProgress(newProgress);

      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/courses/${id}/progress`,
        {
          progress: newProgress,
          completedSteps: Array.from(newCompletedSteps),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Progress update failed:", error);
      setError("Failed to save progress. Please try again.");
    }
  };

  const handleQuizClick = (child, sectionIndex, stepIndex) => {
    navigate("/quiz", {
      state: {
        topic: child.name,
        quizData: child.quiz || [],
        courseId: id,
        sectionIndex,
        stepIndex,
      },
    });
  };

  const handleResourcesClick = (topic) => {
    const searchQuery = encodeURIComponent(topic.trim());
    const searchURL = `https://www.google.com/search?q=site:geeksforgeeks.org+${searchQuery}`;
    window.open(searchURL, "_blank");
  };
  

  const handleNotesClick = (child, sectionIndex, stepIndex) => {
    navigate("/notes", {
      state: {
        topic: child.name,
        courseId: id,
        sectionIndex,
        stepIndex,
        returnPath: `/courses/${id}`,
      },
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!course) return <p>No course found.</p>;

  let stepNumber = 1;

  return (
    <div className="course-container">
      <h2>{course.technology} Learning Pathway</h2>
      <ProgressBar now={progress} className="h-5" />
      <table className="pathway-table">
        <thead>
          <tr>
            <th>Sr.No.</th>
            <th>Description</th>
            <th>Status</th>
            <th>Resources</th>
            <th>Notes</th>
            <th>Quiz</th>
          </tr>
        </thead>
        <tbody>
          {course.pathway.map((section, sectionIndex) =>
            section.children.map((child, stepIndex) => {
              const stepId = `${sectionIndex}-${stepIndex}`;
              const isCompleted = completedSteps.has(stepId);
              
              return (
                <tr key={stepId}>
                  <td>{stepNumber++}</td>
                  <td>{child.name}</td>
                  <td>
                    <input
                      type="checkbox"
                      id={`step-${stepId}`}
                      checked={isCompleted}
                      onChange={() => handleStepClick(sectionIndex, stepIndex)}
                    />
                    <label htmlFor={`step-${stepId}`}></label>
                  </td>
                  <td>
                    <button 
                      onClick={() => handleResourcesClick(child.name)}
                      className="resource-btn"
                    >
                      Resources
                    </button>
                  </td>
                  <td>
                    <button 
                      onClick={() => handleNotesClick(child, sectionIndex, stepIndex)}
                      className="notes-btn"
                    >
                      Notes
                    </button>
                  </td>
                  <td>
                    <button 
                      onClick={() => handleQuizClick(child, sectionIndex, stepIndex)}
                      className="quiz-btn"
                    >
                      Quiz
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CoursePathway;








// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import ReactMarkdown from "react-markdown";
// import { ProgressBar } from "react-bootstrap";
// import "./CoursePathway.css";

// const CoursePathway = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [progress, setProgress] = useState(0);
//   const [completedSteps, setCompletedSteps] = useState(new Set());

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

//         setCourse(fetchedCourse);
//         setProgress(fetchedCourse.progress || 0);

//         // Calculate completed steps based on progress percentage
//         if (fetchedCourse.pathway) {
//           const totalSteps = fetchedCourse.pathway.reduce(
//             (acc, section) => acc + section.children.length,
//             0
//           );
//           const completedCount = Math.round((fetchedCourse.progress / 100) * totalSteps);
          
//           const newCompletedSteps = new Set();
//           let stepsProcessed = 0;
          
//           // Mark steps as completed until we reach the completedCount
//           fetchedCourse.pathway.forEach((section, sectionIndex) => {
//             section.children.forEach((_, stepIndex) => {
//               if (stepsProcessed < completedCount) {
//                 newCompletedSteps.add(`${sectionIndex}-${stepIndex}`);
//                 stepsProcessed++;
//               }
//             });
//           });

//           setCompletedSteps(newCompletedSteps);
//         }
//       } catch (error) {
//         setError(error.response?.data?.message || "Failed to fetch course.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourse();
//   }, [id]);

//   const handleStepClick = async (sectionIndex, stepIndex) => {
//     if (!course) return;

//     try {
//       const stepId = `${sectionIndex}-${stepIndex}`;
//       const newCompletedSteps = new Set(completedSteps);

//       // Toggle completion status
//       if (newCompletedSteps.has(stepId)) {
//         newCompletedSteps.delete(stepId);
//       } else {
//         newCompletedSteps.add(stepId);
//       }

//       // Calculate new progress
//       const totalSteps = course.pathway.reduce(
//         (acc, section) => acc + section.children.length,
//         0
//       );
//       const newProgress = Math.round((newCompletedSteps.size / totalSteps) * 100);

//       // Update state
//       setCompletedSteps(newCompletedSteps);
//       setProgress(newProgress);

//       // Update backend
//       const token = localStorage.getItem("token");
//       await axios.put(
//         `http://localhost:5000/api/courses/${id}/progress`,
//         {
//           progress: newProgress,
//           completedSteps: Array.from(newCompletedSteps),
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           withCredentials: true,
//         }
//       );
//     } catch (error) {
//       console.error("Progress update failed:", error);
//       setError("Failed to save progress. Please try again.");
//     }
//   };

//   const handleQuizClick = (child, sectionIndex, stepIndex) => {
//     navigate("/quiz", {
//       state: {
//         topic: child.name,
//         quizData: child.quiz || [],
//         courseId: id,
//         sectionIndex,
//         stepIndex,
//       },
//     });
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p className="error">{error}</p>;
//   if (!course) return <p>No course found.</p>;

//   let stepNumber = 1;

//   return (
//     <div className="course-container">
//       <h2>{course.technology} Learning Pathway</h2>
//       <ProgressBar now={progress} className="h-5" />
//       <table className="pathway-table">
//         <thead>
//           <tr>
//             <th>Sr.No.</th>
//             <th>Description</th>
//             <th>Status</th>
//             <th>Quiz</th>
//           </tr>
//         </thead>
//         <tbody>
//           {course.pathway.map((section, sectionIndex) =>
//             section.children.map((child, stepIndex) => {
//               const stepId = `${sectionIndex}-${stepIndex}`;
//               const isCompleted = completedSteps.has(stepId);
              
//               return (
//                 <tr key={stepId}>
//                   <td>{stepNumber++}</td>
//                   <td>{child.name}</td>
//                   <td>
//                     <input
//                       type="checkbox"
//                       id={`step-${stepId}`}
//                       checked={isCompleted}
//                       onChange={() => handleStepClick(sectionIndex, stepIndex)}
//                     />
//                     <label htmlFor={`step-${stepId}`}></label>
//                   </td>
//                   <td>
//                     <button onClick={() => handleQuizClick(child, sectionIndex, stepIndex)}>
//                       Quiz
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default CoursePathway;