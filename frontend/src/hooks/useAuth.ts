import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userCredentials = localStorage.getItem("userCredentials");
    if (!userCredentials) {
      navigate("/signup");
    }
  }, [navigate]);

  return JSON.parse(localStorage.getItem("userCredentials") || "{}");
};

export {};
