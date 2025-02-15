import React, { useEffect } from "react";
import "./LandingPage.css"; // Import the CSS file
import { getSocket } from "../socket";

const LandingPage = () => {
  useEffect(() => {
    getSocket();
    console.log("Get socket called ");
  }, []);
  
  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="navbar">
        <h1 className="logo">ChillGuy.ai</h1>
        <div className="nav-links">
          <a href="#">Resources</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </div>
        <div className="nav-buttons">
          <button className="btn btn-outline">Sign in</button>
          <button className="btn btn-dark">Register</button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero">
        <h1 className="hero-title">ChillGuy.ai</h1>
        <p className="hero-text">Calmness a call away</p>
        <div className="hero-buttons">
          <button className="btn btn-outline">Learn More</button>
          <button className="btn btn-dark">Sign Up</button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
