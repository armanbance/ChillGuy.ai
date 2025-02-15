import React, { useEffect, useState } from "react";
import { emitSocketEvent, getSocket, addSocketListener } from "../socket";

const CallButton = () => {
  const [callStatus, setCallStatus] = useState<string>("");

  useEffect(() => {
    const handleCallStatus = (data: { status: string; message: string }) => {
      if (data.status === "success") {
        setCallStatus(data.message);
      } else {
        setCallStatus(data.message);
      }
    };

    // Register socket listener
    addSocketListener("callStatus", handleCallStatus);

    // Cleanup listener when component unmounts
    return () => {
      const socket = getSocket();
      socket?.off("callStatus", handleCallStatus);
    };
  }, []);

  const makeCall = () => {
    setCallStatus("Initiating call...");
    emitSocketEvent("makeCall", "Message from client");
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <button onClick={makeCall} disabled={callStatus === "Initiating call..."}>
        Make Test Call
      </button>
      {callStatus && <p>{callStatus}</p>}
    </div>
  );
};

export default CallButton;
