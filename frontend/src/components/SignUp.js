// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import Lottie from "lottie-react";
// import signupAnimation from "../assets/signup-animation.json"; // Add your Lottie JSON file here

// const SignUp = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(""); // Clear previous errors

//     axios
//       .post("http://localhost:5000/api/signup", {
//         name: formData.name,
//         email: formData.email,
//         password: formData.password,
//       })
//       .then((result) => {
//         setLoading(false);
//         setSuccess("🎉 Woohoo! Account created! Time to rock 'n roll! 🎉");
//         setFormData({ name: "", email: "", password: "" }); // Clear form fields
//       })
//       .catch((err) => {
//         setLoading(false);
//         setError("😱 Oops! Something went wrong. Try again, maybe? 😱");
//         console.error(err);
//       });
//   };

//   return (
//     <div
//       className="container-fluid d-flex align-items-center justify-content-center"
//       style={{ height: "100vh", backgroundColor: "#f8f9fa" }}
//     >
//       <div
//         className="row w-100 justify-content-center align-items-center"
//         style={{ maxWidth: "1200px", margin: "0 auto" }}
//       >
//         {/* Animation Section */}
//         <div className="col-md-6 d-flex justify-content-center align-items-center p-0">
//           <Lottie
//             animationData={signupAnimation}
//             loop={true}
//             style={{
//               width: "100%",
//               height: "100%",
//               maxWidth: "500px", // Increased size
//               maxHeight: "500px", // Increased size
//             }}
//           />
//         </div>

//         {/* Form Section */}
//         <div className="col-md-6 d-flex justify-content-center align-items-center p-0">
//           <div
//             className="card p-5 shadow-lg"
//             style={{
//               fontFamily: "Arial, sans-serif", // Normal font
//               width: "100%",
//               maxWidth: "500px", // Increased size
//               borderRadius: "15px",
//               border: "none",
//               backgroundColor: "#ffffff",
//               boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//               transition: "transform 0.3s ease, box-shadow 0.3s ease",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.transform = "translateY(-5px)";
//               e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.transform = "translateY(0)";
//               e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
//             }}
//           >
//             <h2 className="text-center mb-4 text-warning text-purple-600" style={{ fontSize: "2rem" }}>
//               Sign Up
//             </h2>

//             {/* Success Message */}
//             {success && (
//               <div className="alert alert-success text-center">{success}</div>
//             )}

//             {/* Error Message */}
//             {error && <div className="alert alert-danger text-center">{error}</div>}

//             <form onSubmit={handleSubmit}>
//               <div className="mb-4">
//                 <label className="form-label" style={{ fontSize: "1.1rem" }}>
//                   Name
//                 </label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                   style={{
//                     padding: "10px",
//                     borderRadius: "8px",
//                     border: "1px solid #ced4da",
//                     transition: "border-color 0.3s ease",
//                   }}
//                   onFocus={(e) => {
//                     e.target.style.borderColor = "#ffc107";
//                   }}
//                   onBlur={(e) => {
//                     e.target.style.borderColor = "#ced4da";
//                   }}
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="form-label" style={{ fontSize: "1.1rem" }}>
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   className="form-control"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                   style={{
//                     padding: "10px",
//                     borderRadius: "8px",
//                     border: "1px solid #ced4da",
//                     transition: "border-color 0.3s ease",
//                   }}
//                   onFocus={(e) => {
//                     e.target.style.borderColor = "#ffc107";
//                   }}
//                   onBlur={(e) => {
//                     e.target.style.borderColor = "#ced4da";
//                   }}
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="form-label" style={{ fontSize: "1.1rem" }}>
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   className="form-control"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                   style={{
//                     padding: "10px",
//                     borderRadius: "8px",
//                     border: "1px solid #ced4da",
//                     transition: "border-color 0.3s ease",
//                   }}
//                   onFocus={(e) => {
//                     e.target.style.borderColor = "#ffc107";
//                   }}
//                   onBlur={(e) => {
//                     e.target.style.borderColor = "#ced4da";
//                   }}
//                 />
//               </div>

//               {/* Submit Button with Loading State */}
//               <button
//                 type="submit"
//                 className="btn btn-warning w-100 py-3"
//                 disabled={loading}
//                 style={{
//                   fontSize: "1.1rem",
//                   fontWeight: "bold",
//                   borderRadius: "8px",
//                   transition: "background-color 0.3s ease",
//                 }}
//                 onMouseEnter={(e) => {
//                   e.target.style.backgroundColor = "#e0a800";
//                 }}
//                 onMouseLeave={(e) => {
//                   e.target.style.backgroundColor = "#ffc107";
//                 }}
//               >
//                 {loading ? "Casting Magic..." : "Let's Rock 'n Roll! 🚀"}
//               </button>
//             </form>

//             {/* Already have an account */}
//             <p className="text-center mt-4 text-dark" style={{ fontSize: "1rem" }}>
//               Already part of the crew?{" "}
//               <Link to="/login" className="text-primary" style={{ textDecoration: "none" }}>
//                 Login here and join the fun!
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUp;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Lottie from "lottie-react";
import signupAnimation from "../assets/signup-animation.json"; // Ensure the JSON animation is present
import "./SignUp.css";

const SignUp = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [bgPosition, setBgPosition] = useState({ x: 50, y: 50 });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    axios
      .post("http://localhost:5000/api/signup", formData)
      .then(() => {
        setLoading(false);
        setSuccess("🎉 Woohoo! Account created! Time to rock 'n roll! 🎉");
        setFormData({ name: "", email: "", password: "" });
      })
      .catch((err) => {
        setLoading(false);
        setError("😱 Oops! Something went wrong. Try again, maybe? 😱");
        console.error(err);
      });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Dynamically shift background gradient based on mouse movement
      setBgPosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="signup-container"
      style={{
        background: `radial-gradient(circle at ${bgPosition.x}% ${bgPosition.y}%, #ff0080, #8000ff, #00ffff)`,
      }}
    >
      {/* Glowing Mouse Tracker */}
      <div
        className="mouse-tracker"
        style={{
          left: mousePosition.x - 150,
          top: mousePosition.y - 150,
        }}
      ></div>

      <div className="content-wrapper">
        {/* Animation Section */}
        <div className="animation-container">
          <Lottie animationData={signupAnimation} loop className="signup-animation" />
        </div>

        {/* Form Section */}
        <div className="form-container">
          <div className="signup-card">
            <h2 className="signup-title">Sign Up</h2>

            {success && <div className="alert alert-success">{success}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />
              </div>

              <button type="submit" className="signup-btn" disabled={loading}>
                {loading ? "Casting Magic..." : "Let's Rock 'n Roll! 🚀"}
              </button>
            </form>

            <p className="login-link">
              Already part of the crew? <Link to="/login">Login here and join the fun!</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
