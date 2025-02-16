import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import LandingPage from "./components/LandingPage";
import SignupPage from "./components/SignupPage";
import ContactPage from "./components/ContactPage";
import ResourcesPage from "./components/ResourcesPage";
import reportWebVitals from "./reportWebVitals";
import CallButton from "./components/CallButton";
import AboutPage from "./components/AboutPage";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="919529792912-v5s1mee0jepsgi4tq2mjvf5ei7ia3obq.apps.googleusercontent.com">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/register" element={<SignupPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/call" element={<CallButton />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
