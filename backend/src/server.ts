import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const server = createServer(app);

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || "";

mongoose.set("strictQuery", false);
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const io = new Server(server, {
  transports: ["websocket", "polling"],
  cors: {
    origin: "*", // Update with your frontend's URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.send("Hello, TypeScript Server!");
});

io.on("connection", (socket: Socket) => {
  console.log("A user connected:", socket.id);
  socket.on("hello", async (data) => {
    console.log("hello");
  });
  socket.on("saveUser", async (user) => {
    // try {
    //   const newUser = new User(user);
    //   await newUser.save();
    //   console.log("User saved successfully:", newUser);
    //   socket.emit("userSaved", { success: true, user: newUser });
    // } catch (error) {
    //   console.error("Error saving user:", error);
    //   socket.emit("userSaved", { success: false, error: error.message });
    // }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Socket.IO server running on http://localhost:${PORT}`);
});
