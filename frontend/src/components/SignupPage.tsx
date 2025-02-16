import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { emitSocketEvent, addSocketListener } from "../socket";
import "./SignupPage.css";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import axios from "axios";

interface SignupForm {
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
}

interface GoogleUser {
  access_token: string;
}

interface UserProfile {
  picture: string;
  name: string;
  email: string;
}

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (user?.access_token) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          setProfile(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  const logOut = () => {
    googleLogout();
    setProfile(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Emit the signup data through socket
    console.log("form data:", formData);
    emitSocketEvent("saveUser", formData);

    // Listen for the response from the server
    addSocketListener<{ success: boolean; user?: any; error?: any }>(
      "userSaved",
      (response) => {
        if (response.success) {
          console.log("User registered successfully:", response.user);
          // Redirect to another page (e.g., landing page) after successful signup
          navigate("/");
        } else {
          console.error("Registration failed:", response.error);
          // Handle error (show error message to user)
        }
      }
    );
  };

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("Google login success:", tokenResponse);
      localStorage.setItem("userCredentials", JSON.stringify(tokenResponse));
      navigate("/call");
    },
    scope: "https://www.googleapis.com/auth/calendar.events",
    onError: () => console.log("Login Failed"),
  });

  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="logo">
          ChillGuy.ai
        </Link>
        <div className="nav-links">
          <a href="/resources">Resources</a>
          <a href="#">About</a>
          <a href="/contact">Contact</a>
          <Link to="/resources">Resources</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="nav-buttons">
          <Link to="/signup" className="btn btn-outline">
            Sign in
          </Link>
          <Link to="/signup" className="btn btn-dark">
            Register
          </Link>
        </div>
      </nav>

      <div className="signup-content">
        <div className="signup-text">
          <h1>Peace, One Call at a Time</h1>
          <p>
            Create an account to access exclusive features and start chatting
            with your personal AI assistant. Our platform provides a seamless
            experience for managing your digital needs.
          </p>
          <p>Benefits of joining:</p>
          <ul>
            <li>Access to premium features</li>
            <li>Connect and chat with other AI agents</li>
            <li>Personalized experience</li>
            <li>Regular updates and notifications</li>
          </ul>
        </div>
        <div className="signup-form-container">
          <h2>Sign Up</h2>
          <button onClick={() => login()} className="google-login-button">
            <img src="/google-logo.png" alt="Google" className="google-logo" />
            Use Google To Sign In
          </button>
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="signup-button">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
