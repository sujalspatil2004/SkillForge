

import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa"; // Import trash icon
import "./Dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";


const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("You are not authenticated. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:5000/api/courses/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        setCourses(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch courses. Please try again later.");
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const getRingColorClass = (progress) => {
    if (progress <= 20) return "red";
    if (progress <= 40) return "yellow";
    if (progress <= 70) return "lightgreen";
    return "green";
  };

  const getRandomColor = () => {
    const colors = ["#7b1a98", "#6638a8", "#3f46ac", "#3581ad", "#35ad9d", "#2ca569", "#49a52c", "#84a52c", "#b69428"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleDelete = async (courseId) => {
    if (
      window.confirm("⚠️ Are you sure you want to delete this course? This action cannot be undone!")
    ) {
      try {
        await axios.delete(`http://localhost:5000/api/courses/${courseId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setCourses((prevCourses) => prevCourses.filter(course => course._id !== courseId));
      } catch (error) {
        alert("❌ Failed to delete the course. Please try again later.");
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-4 text-danger">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="text-left mb-4 title">My Learnings:</h2>
      <div className="row">
        {courses.map((course, index) => (
          <div key={index} className="col-md-3 mx-3 mb-4">
            <div className="card learning-card text-center p-4" style={{ backgroundColor: getRandomColor() }}>
              <h5 className="card-title text-white h2 text-right">{course.technology}</h5>
              <div className="progress-circle">
                <svg width="100" height="100" viewBox="0 0 100 100" className="progress-ring">
                  <circle className="progress-bg" cx="50" cy="50" r="40" />
                  <circle
                    className={`progress-bar ${getRingColorClass(course.progress)}`}
                    cx="50"
                    cy="50"
                    r="40"
                    strokeDasharray="251.2"
                    strokeDashoffset={`${251.2 - (251.2 * course.progress) / 100}`}
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <text x="50" y="50" textAnchor="middle" className="progress-text" dy="0.3em">
                    {course.progress}%
                  </text>
                </svg>
              </div>
              <div className="button-group">
                {/* Delete Button */}
                <button className="delete-button" onClick={() => handleDelete(course._id)}>
                  {/* <FaTrash /> */}
                  {/* <FontAwesomeIcon icon="fa-duotone fa-regular fa-trash" style={{"--fa-primary-color": "#080808", "--fa-secondary-color": "#ff0000",}} /> */}
                  <FontAwesomeIcon
                    icon={faTrash}
                    style={{ color: "#ff0000", fontSize: "30px" }}
                  />

                </button>
                {/* Start Button */}
                <button className="start-button" onClick={() => navigate(`/courses/${course._id}`)}>
                  Start
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { useNavigate } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import "./Dashboard.css";

// const Dashboard = () => {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         if (!token) {
//           setError("You are not authenticated. Please log in.");
//           setLoading(false);
//           navigate("/login");
//           return;
//         }

//         const response = await axios.get("http://localhost:5000/api/courses", {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         setCourses(response.data);
//       } catch (error) {
//         console.error("Error fetching courses:", error);
//         setError("Failed to fetch courses. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, [navigate]);

//   const getRingColorClass = (progress) => {
//     if (progress <= 20) return "red";
//     if (progress <= 40) return "yellow";
//     if (progress <= 70) return "lightgreen";
//     return "green";
//   };

//   const getRandomColor = () => {
//     const colors = [
//       "#7b1a98", "#6638a8", "#3f46ac", 
//       "#3581ad", "#35ad9d", "#2ca569",
//       "#49a52c", "#84a52c", "#b69428"
//     ];
//     return colors[Math.floor(Math.random() * colors.length)];
//   };

//   const handleDelete = async (courseId) => {
//     if (window.confirm("⚠️ Are you sure you want to delete this course? This action cannot be undone!")) {
//       try {
//         await axios.delete(`http://localhost:5000/api/courses/${courseId}`, {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });

//         setCourses(prevCourses => prevCourses.filter(course => course._id !== courseId));
//       } catch (error) {
//         alert("❌ Failed to delete the course. Please try again later.");
//       }
//     }
//   };

//   if (loading) {
//     return (
//       <div className="dashboard-loading">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return <div className="dashboard-error">{error}</div>;
//   }

//   return (
//     <div className="dashboard-container">
//       <h2 className="dashboard-title">My Learnings</h2>
      
//       {courses.length === 0 ? (
//         <div className="no-courses">
//           <p>You don't have any courses yet. Create your first course to get started!</p>
//         </div>
//       ) : (
//         <div className="courses-grid">
//           {courses.map((course, index) => (
//             <div key={index} className="course-card" style={{ backgroundColor: getRandomColor() }}>
//               <div className="course-header">
//                 <h3 className="course-title">{course.technology}</h3>
//                 <button 
//                   className="delete-btn"
//                   onClick={() => handleDelete(course._id)}
//                 >
//                   <FontAwesomeIcon icon={faTrash} />
//                 </button>
//               </div>
              
//               <div className="progress-circle">
//                 <svg width="100" height="100" viewBox="0 0 100 100">
//                   <circle className="progress-bg" cx="50" cy="50" r="40" />
//                   <circle
//                     className={`progress-bar ${getRingColorClass(course.progress)}`}
//                     cx="50"
//                     cy="50"
//                     r="40"
//                     strokeDasharray="251.2"
//                     strokeDashoffset={251.2 - (251.2 * course.progress) / 100}
//                   />
//                   <text x="50" y="50" textAnchor="middle" dy=".3em">
//                     {course.progress}%
//                   </text>
//                 </svg>
//               </div>
              
//               <button 
//                 className="start-btn"
//                 onClick={() => navigate(`/courses/${course._id}`)}
//               >
//                 Start Learning
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;