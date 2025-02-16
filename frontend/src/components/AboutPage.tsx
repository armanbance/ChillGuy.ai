import React from "react";
import { Link } from 'react-router-dom';
import "./AboutPage.css";

const AboutPage = () => {
  return (
    <div className="about-container">
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="logo">ChillGuy.ai</Link>
        <div className="nav-links">
          <Link to="/resources">Resources</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="nav-buttons">
          <Link to="/signup" className="btn btn-outline">Sign in</Link>
          <Link to="/signup" className="btn btn-dark">Register</Link>
        </div>
      </nav>

      {/* About Content */}
      <div className="about-content">
        <img 
          src="/Chill_guy_original_artwork.png" 
          alt="ChillGuy.ai Logo" 
          className="about-image"
        />
        
        <section className="about-section">
          <h2>What is ChillGuy.ai?</h2>
          <p>
          ChillGuy.ai is an AI-powered mental health companion designed to
          provide users with a personalized check-in system through voice calls. 
          Our goal is to offer a compassionate, accessible, and proactive approach to mental well-being.
          </p>
        </section>

        <section className="about-section">
          <h2>What Problem Does ChillGuy.ai Aim to Solve?</h2>
          <p>
            In today's fast-paced world, many people struggle with stress, anxiety, and loneliness. 
            Despite the increasing awareness of mental health issues, accessing consistent support 
            remains a challenge due to:
          </p>
          <ul className="about-list">
            <li>Lack of immediate emotional support between therapy sessions</li>
            <li>Difficulty in self-monitoring emotional states</li>
            <li>High costs associated with traditional therapy</li>
            <li>Lack of convenient and accessible mental health resources</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>How Does ChillGuy.ai Solve This?</h2>
          <p>
            ChillGuy.ai provides scheduled AI voice check-ins, allowing users to:
          </p>
          <ul className="about-list">
            <li>Receive AI-driven emotional support</li>
            <li>Monitor emotional changes over time</li>
            <li>Engage in breathing exercises and mindfulness practices</li>
          </ul>
        </section>


      </div>
    </div>
  );
};

export default AboutPage;