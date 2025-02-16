import React, { useEffect, useState } from "react";
import { emitSocketEvent, getSocket, addSocketListener } from "../socket";
import { Link } from 'react-router-dom';
import "./CallButton.css";
import { useAuth } from "../hooks/useAuth";

const CallButton = () => {
  const [callStatus, setCallStatus] = useState<string>("");
  const [scheduledTime, setScheduledTime] = useState<string>("");
  const [userPhone, setUserPhone] = useState<string>("");
  const userCredentials = useAuth();

  useEffect(() => {
    const handleCallStatus = (data: { status: string; message: string }) => {
      setCallStatus(data.message);
    };

    // Register socket listener
    addSocketListener("callStatus", handleCallStatus);

    // Cleanup listener when component unmounts
    return () => {
      const socket = getSocket();
      socket?.off("callStatus", handleCallStatus);
    };
  }, []);

  const addToGoogleCalendar = async (scheduledDateTime: Date) => {
    try {
      const event = {
        summary: "Check up with ChillGuy.ai",
        description: "Scheduled wellness check-in call with ChillGuy.ai",
        start: {
          dateTime: scheduledDateTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: new Date(
            scheduledDateTime.getTime() + 30 * 60000
          ).toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      };

      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userCredentials.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(event),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create calendar event");
      }

      setCallStatus("Call scheduled and added to your Google Calendar!");
    } catch (error) {
      console.error("Error adding to calendar:", error);
      setCallStatus("Call scheduled, but failed to add to calendar");
    }
  };

  const scheduleCall = async () => {
    if (!scheduledTime || !userPhone) {
      setCallStatus("Please enter both phone number and time");
      return;
    }

    const scheduledDateTime = new Date(scheduledTime);
    const now = new Date();

    if (scheduledDateTime <= now) {
      setCallStatus("Please select a future time");
      return;
    }

    emitSocketEvent("scheduleCall", {
      phone: userPhone,
      scheduledTime: scheduledTime,
    });

    await addToGoogleCalendar(scheduledDateTime);
  };

  const makeCall = () => {
    setCallStatus("Initiating call...");
    emitSocketEvent("makeCall", { phone: userPhone });
  };

  return (
    <div className="call-container">
      {/* Added Navbar */}
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

      <div className="call-content">
        <h1 className="call-title">Schedule Your Call</h1>
        <div className="input-group">
          <input
            type="tel"
            placeholder="Enter your phone number"
            value={userPhone}
            onChange={(e) => setUserPhone(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="datetime-local"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            required
          />
        </div>
        <div className="button-group">
          <button
            className="call-button schedule-button"
            onClick={scheduleCall}
            disabled={
              callStatus === "Initiating call..." ||
              !userPhone ||
              !scheduledTime
            }
          >
            Schedule Call
          </button>
          <button
            className="call-button test-call-button"
            onClick={makeCall}
            disabled={callStatus === "Initiating call..."}
          >
            Make Test Call
          </button>
        </div>
        {callStatus && <p className="status-message">{callStatus}</p>}
      </div>
    </div>
  );
};

export default CallButton;