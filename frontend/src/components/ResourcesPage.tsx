import React from "react";
import { Link } from "react-router-dom";
import "./ResourcesPage.css";

const ResourcesPage: React.FC = () => {
  return (
    <div className="resources-page">
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="logo">ChillGuy.ai</Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="nav-buttons">
          <Link to="/signin" className="btn btn-outline">
            Sign in
          </Link>
          <Link to="/signup" className="btn btn-dark">
            Register
          </Link>
        </div>
      </nav>

      <div className="resources-content">
        <h1>Mental Health Resources</h1>

        <div className="resource-categories">
          <div className="resource-category">
            <h2>Emergency Hotlines</h2>
            <ul>
              <li>National Suicide Prevention Lifeline: 1-800-273-8255</li>
              <li>Crisis Text Line: Text HOME to 741741</li>
              <li>988 Suicide & Crisis Lifeline: Dial 988 </li>
              <li>
                National Alliance on Mental Illness Helpline: Call
                1-800-950-NAMI
              </li>
              <li>National Domestic Violence Hotline: Call 1-800-799-SAFE</li>
              <li>Sexual Assault Support Hotline: Call 1-800-656-HOPE</li>
            </ul>
          </div>

          <div className="resource-category">
            <h2>Online Therapy & Support Services</h2>
            <ul>
              <li>
                <a
                  href="https://www.betterhelp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  BetterHelp
                </a>
                : Online therapy platform
              </li>
              <li>
                <a
                  href="https://www.talkspace.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Talkspace
                </a>
                : Therapy for all
              </li>
              <li>
                <a
                  href="https://www.mhanational.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Mental Health America
                </a>
                : Mental health support and resources
              </li>
              <li>
                <a
                  href="https://psychcentral.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Psych Central
                </a>
                : Mental health information and support
              </li>
              <li>
                <a
                  href="https://www.psychologyhelp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Psychology Help
                </a>
                : Online therapy and counseling services
              </li>
              <li>
                <a
                  href="https://www.openpathcollective.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Path Collective
                </a>
                : Affordable therapy services
              </li>
            </ul>
          </div>

          <div className="resource-category">
            <h2>Books and Podcasts</h2>
            <ul>
              <li>"The Happiness Trap" by Russ Harris</li>
              <li>"The Mindful Kind with Rachael Kable" Podcast</li>
              <li>"The Body Keeps the Score" by Bessel van der Kolk</li>
              <li>"The Happiness Lab with Dr. Laurie Santos" Podcast</li>
              <li>"Daring Greatly" by Brené Brown</li>
              <li>
                "Feel Better, Live More with Dr. Rangan Chatterjee" Podcast
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;
