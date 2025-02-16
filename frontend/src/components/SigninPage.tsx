import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SigninPage.css";
import GoogleLoginButton from "./GoogleLoginButton";
import { signIn } from "../api/signInApi";

// interface SigninResponse {
//   success: boolean;
//   message?: string;
//   user?: {
//     email: string;
//   };
// }

const SigninPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

 

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setFormData({
  //     ...formData,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {

      // debug statement
      console.log("Attempting to sign in with:", formData);

      const response = await signIn(formData);
      console.log("Sign in successful:", response);
      navigate("/call");
    } catch (error: any) {
      console.error("Sign in error:", error);
      setError(error.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="signin-container">
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="logo">
          ChillGuy.ai
        </Link>
        <div className="nav-links">
          <Link to="/resources">Resources</Link>
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

      {/* Sign In Form */}
      <div className="signin-form-container">
        <div className="signin-form-box">
          <h2>Welcome Back</h2>
          <p>Sign in to your account</p>

          <GoogleLoginButton onError={setError} />

          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}

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

            <button type="submit" className="btn btn-dark">
              Sign In
            </button>
          </form>

          <p className="signup-link">
            Don't have an account? <Link to="/signup">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
