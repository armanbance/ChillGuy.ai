import React, { useEffect, useState } from "react";
import { emitSocketEvent, getSocket, addSocketListener } from "../socket";
import "./CallButton.css";

const CallButton = () => {
  const [callStatus, setCallStatus] = useState<string>("");
  const [scheduledTime, setScheduledTime] = useState<string>("");
  const [userPhone, setUserPhone] = useState<string>("");

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

  const scheduleCall = () => {
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

    // Replace 'YOUR_USER_ID' with actual user ID from your authentication system
    emitSocketEvent("scheduleCall", {
      phone: userPhone,
      scheduledTime: scheduledTime,
    });
    setCallStatus("Scheduling call...");
  };

  const makeCall = () => {
    setCallStatus("Initiating call...");
    emitSocketEvent("makeCall", { phone: userPhone });
  };

  return (
    <div className="call-container">
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
