import React from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import "./GoogleLoginButton.css";

interface GoogleLoginButtonProps {
  onError?: (error: string) => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onError }) => {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("Google login success:", tokenResponse);
      localStorage.setItem("userCredentials", JSON.stringify(tokenResponse));
      navigate("/call");
    },
    scope: "https://www.googleapis.com/auth/calendar.events",
    onError: () => {
      onError?.("Google login failed");
      console.log("Login Failed");
    },
  });

  return (
    <button onClick={() => login()} className="google-login-button">
      <img src="/google-logo.png" alt="Google" className="google-logo" />
      Sign in with Google
    </button>
  );
};

export default GoogleLoginButton;
