import React from 'react';
import { Link } from 'react-router-dom';
import './ContactPage.css';

const ContactPage = () => {
  return (
    <div className="contact-page">
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="logo">ChillGuy.ai</Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/resources">Resources</Link>
        </div>
        <div className="nav-buttons">
          <Link to="/signup" className="btn btn-outline">Sign in</Link>
          <Link to="/signup" className="btn btn-dark">Register</Link>
        </div>
      </nav>

     
      {/* Contact Info */}
      <div className="contact-content">
        <h3>Get in Touch</h3>
        <h1>Contact Me</h1>
        <div className="contact-details">
          <div className="contact-item">
            <span>📧</span> example@gmail.com
          </div>
          <div className="contact-item">
            <span>📲</span> 123-456-7890
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="footer-links">
        <Link to="/about">About</Link>
        <Link to="/resources">Resources</Link>
        <Link to="/register">Register</Link>
      </div>
    </div>


  );
};

export default ContactPage;