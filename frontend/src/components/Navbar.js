

import React, { useState } from "react";
import { User } from "lucide-react"; // User icon
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css"; // Ensure this CSS file contains styles for dropdown

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get current route

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setDropdownOpen(false);
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      {/* Web Logo */}
      <a className="navbar-brand m-3" href="#">
        <img
          src="path-to-your-logo.png" // Replace with your actual logo path
          alt="Web Logo"
          width="30"
          height="30"
          className="d-inline-block align-top"
        />
      </a>

      {/* Navbar Toggler for Mobile */}
      <button
        className="navbar-toggler m-3"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* Navbar Links */}
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className={`nav-item m-3 ${location.pathname === "/dashboard" ? "active" : ""}`}>
            <a className="nav-link" href="/dashboard">Dashboard</a>
          </li>
          <li className={`nav-item m-3 ${location.pathname === "/" ? "active" : ""}`}>
            <a className="nav-link" href="/explore">Explore Tech</a>
          </li>
          <li className={`nav-item m-3 ${location.pathname === "/about" ? "active" : ""}`}>
            <a className="nav-link" href="/about">About Us</a>
          </li>
          <li className={`nav-item m-3 ${location.pathname === "/contact" ? "active" : ""}`}>
            <a className="nav-link" href="/contact">Contact</a>
          </li>
        </ul>

        {/* User Dropdown */}
        <div className="ml-auto user-dropdown" style={{ position: "relative" }}>
          <button className="nav-link user-icon-btn" onClick={toggleDropdown}>
            <User size={30} />
          </button>

          {dropdownOpen && (
            <div className="dropdown-menu show" style={{ position: "absolute", right: 0, top: "100%" }}>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/profile");
                }}
              >
                Profile
              </a>
              <a className="dropdown-item" href="#" onClick={handleLogout}>
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;



// import React, { useState } from "react";
// import { User } from "lucide-react"; // User icon
// import { useNavigate } from "react-router-dom";
// import "./Navbar.css"; // Ensure this CSS file contains styles for dropdown

// const Navbar = () => {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const navigate = useNavigate();

//   const toggleDropdown = () => {
//     setDropdownOpen(!dropdownOpen);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setDropdownOpen(false);
//     navigate("/login");
//     window.location.reload();
//   };

//   return (
//     <nav className="navbar navbar-expand-lg navbar-light bg-light">
//       {/* Web Logo */}
//       <a className="navbar-brand m-3" href="#">
//         <img
//           src="path-to-your-logo.png" // Replace with your actual logo path
//           alt="Web Logo"
//           width="30"
//           height="30"
//           className="d-inline-block align-top"
//         />
//       </a>

//       {/* Navbar Toggler for Mobile */}
//       <button
//         className="navbar-toggler m-3"
//         type="button"
//         data-toggle="collapse"
//         data-target="#navbarSupportedContent"
//         aria-controls="navbarSupportedContent"
//         aria-expanded="false"
//         aria-label="Toggle navigation"
//       >
//         <span className="navbar-toggler-icon"></span>
//       </button>

//       {/* Navbar Links */}
//       <div className="collapse navbar-collapse" id="navbarSupportedContent">
//         <ul className="navbar-nav mr-auto">
//           <li className="nav-item active m-3">
//             <a className="nav-link" href="/dashboard">Dashboard</a>
//           </li>
//           <li className="nav-item m-3">
//             <a className="nav-link" href="/">Explore Tech</a>
//           </li>
//           <li className="nav-item m-3">
//             <a className="nav-link" href="#">About Us</a>
//           </li>
//           <li className="nav-item m-3">
//             <a className="nav-link" href="#">Contact</a>
//           </li>
//         </ul>

//         {/* User Dropdown */}
//         <div className="ml-auto user-dropdown">
//           <button className="nav-link user-icon-btn" onClick={toggleDropdown}>
//             <User size={30} />
//           </button>

//           {dropdownOpen && (
//             <div className="dropdown-menu show">
//               <a
//                 className="dropdown-item"
//                 href="#"
//                 onClick={() => {
//                   setDropdownOpen(false);
//                   navigate("/profile");
//                 }}
//               >
//                 Profile
//               </a>
//               <a className="dropdown-item" href="#" onClick={handleLogout}>
//                 Logout
//               </a>
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;