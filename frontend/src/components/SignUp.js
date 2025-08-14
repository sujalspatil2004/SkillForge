import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Lottie from "lottie-react";
import signupAnimation from "../assets/signup-animation.json";
import "./SignUp.css";

const SignUp = () => {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "" 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/signup", 
        formData
      );
      
      setSuccess("Account created successfully! Redirecting to login...");
      setFormData({ name: "", email: "", password: "" });
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-content">
        {/* Animation Section */}
        <div className="signup-animation-container">
          <Lottie 
            animationData={signupAnimation} 
            loop 
            className="signup-animation" 
          />
        </div>

        {/* Form Section */}
        <div className="signup-form-container">
          <div className="signup-card">
            <div className="signup-header">
              <h2>Create Your Account</h2>
              <p>Join our community today</p>
            </div>

            {success && (
              <div className="alert alert-success">
                {success}
              </div>
            )}
            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="signup-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  minLength="6"
                />
                <small className="password-hint">
                  Minimum 6 characters
                </small>
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="signup-button" 
                  disabled={loading}
                >
                  {loading ? (
                    <span className="button-loader"></span>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>

              <div className="signup-footer">
                <p>
                  Already have an account?{" "}
                  <Link to="/login" className="login-link">
                    Sign in
                  </Link>
                </p>
                <div className="terms-agreement">
                  By signing up, you agree to our <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy Policy</Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;