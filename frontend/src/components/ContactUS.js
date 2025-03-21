import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ContactUS.css";

const ContactUS = () => {
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="contact-us row shadow-lg rounded bg-white p-5">
        
        {/* Left Side (Icon) */}
        <div className="col-md-5 d-flex justify-content-center align-items-center">
          <img src="https://cdn-icons-png.flaticon.com/512/535/535188.png" alt="Mail Icon" className="img-fluid contact-icon" />
        </div>

        {/* Right Side (Form) */}
        <div className="col-md-7">
          <h2 className="text-center mb-4 display-6">Get in Touch</h2>
          <form>
            <div className="mb-4">
              <input type="text" className="form-control form-control-lg" placeholder="Name" required />
            </div>
            <div className="mb-4">
              <input type="email" className="form-control form-control-lg" placeholder="Email" required />
            </div>
            <div className="mb-4">
              <input type="text" className="form-control form-control-lg" placeholder="Subject" required />
            </div>
            <div className="mb-4">
              <textarea className="form-control form-control-lg" rows="5" placeholder="Message" required></textarea>
            </div>
            <button type="submit" className="btn btn-success btn-lg w-100">
              Send Email →
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ContactUS;

