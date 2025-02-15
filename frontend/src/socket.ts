import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io("http://localhost:4000", {
      //get your macbook ip address
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("Connected to socket");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket");
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const emitSocketEvent = <T>(eventName: string, data: T) => {
  const socket = getSocket();
  console.log("Emitting event:", eventName);
  socket.emit(eventName, data);
};

export const addSocketListener = <T>(
  eventName: string,
  callback: (data: T) => void
) => {
  const socket = getSocket();
  socket.on(eventName, callback);
  return () => socket.off(eventName, callback);
};
