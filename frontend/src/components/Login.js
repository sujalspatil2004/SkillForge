import React, { useState, useEffect } from "react";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";
import Lottie from "lottie-react";
import loginAnimation from "../assets/login-animation.json"; // Ensure the JSON animation is present
import "./Login.css";


const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [bgPosition, setBgPosition] = useState({ x: 50, y: 50 });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      const response = await axios.post("http://localhost:5000/api/login", formData);
      const token = response.data.token;
  
      // Store the token in localStorage (or sessionStorage based on your preference)
      localStorage.setItem("token", token);
  
      setLoading(false);
      setSuccess("🎉 Welcome back! You are successfully logged in. 🎉");
      setFormData({ email: "", password: "" });
      console.log("Token is ", token)
      // Redirect to home or dashboard
      navigate("/dashboard");
      window.location.reload();
    } catch (err) {
      setLoading(false);
      setError("😱 Oops! Something went wrong. Try again, maybe? 😱");
      console.error(err);
    }
  };
  


  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError("");

  //   axios
  //     .post("http://localhost:5000/api/login", formData)
  //     .then(() => {
  //       setLoading(false);
  //       setSuccess("🎉 Welcome back! You are successfully logged in. 🎉");
  //       setFormData({ email: "", password: "" });
  //       navigate("/"); 
 
  //     })
  //     .catch((err) => {
  //       setLoading(false);
  //       setError("😱 Oops! Something went wrong. Try again, maybe? 😱");
  //       console.error(err);
  //     });
  // };

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
      className="login-container"
      style={{
        background: `radial-gradient(circle at ${bgPosition.x}% ${bgPosition.y}%,rgb(0, 255, 255), #8000ff, #00ffff)`,
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

        {/* <div className="animation-container">
          <Lottie animationData={loginAnimation} loop className="login-animation" />
        </div> */}

        {/* Form Section */}
        <div className="form-container">
          <div className="login-card">
            <h2 className="login-title">Login</h2>

            {success && <div className="alert alert-success">{success}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? "Logging in..." : "Let's Rock 'n Roll! 🚀"}
              </button>
            </form>

            <p className="signup-link">
              New here? <Link to="/signup">Sign up here and join the fun!</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;