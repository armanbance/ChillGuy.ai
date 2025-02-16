import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import dotenv from "dotenv";
import mongoose from "mongoose";
import makeCall from "./twilio";
import User from "./models/User";
import { Document } from "mongoose";

dotenv.config();

const app = express();
const server = createServer(app);

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || "";
console.log("MONGODB_URI:", MONGODB_URI);

interface IUser extends Document {
  phone: string;
  preferences: {
    scheduledTime: Date;
    status: string;
  }[];
}

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

  // Add new socket handler
  socket.on("signin", async (data) => {
    try {
      const user = await User.findOne({ email: data.email });

      if (!user) {
        socket.emit("signinResponse", {
          success: false,
          message: "Invalid email or password",
        });
        return;
      }

      // Note: In a prod environment, passwords should be hashed
      // and use proper password comparison
      if (user.password === data.password) {
        socket.emit("signinResponse", {
          success: true,
          user: {
            email: user.email,
            // Add other non-sensitive user data you want to send
          },
        });
      } else {
        socket.emit("signinResponse", {
          success: false,
          message: "Invalid email or password",
        });
      }
    } catch (error) {
      console.error("Error during signin:", error);
      socket.emit("signinResponse", {
        success: false,
        message: "An error occurred during sign in",
      });
    }
  });

  socket.on("hello", async (data) => {
    console.log("hello");
  });

  socket.on("saveUser", async (user) => {
    console.log("Save user called:", user);
    try {
      const newUser = new User(user);
      await newUser.save();
      socket.emit("userSaved", { success: true, user: newUser });
    } catch (error) {
      console.error("Error saving user:", error);
      socket.emit("userSaved", { success: false, error: error });
    }
  });

  socket.on("makeCall", async (data) => {
    console.log("makeCall initiated with phone:", data.phone);
    try {
      const callSid = await makeCall(data.phone);
      socket.emit("callStatus", {
        status: "success",
        message: "Call initiated successfully!",
      });
    } catch (error) {
      console.error("Error making call:", error);
      socket.emit("callStatus", {
        status: "error",
        message: "Failed to make call. Please try again.",
      });
    }
  });

  socket.on(
    "scheduleCall",
    async (data: { phone: string; scheduledTime: string }) => {
      console.log("Schedule call initiated with data:", {
        phone: data.phone,
        scheduledTime: data.scheduledTime,
        currentTime: new Date().toISOString(),
      });
      try {
        if (!data.phone.startsWith("+")) {
          data.phone = "+1" + data.phone.replace(/\D/g, "");
        }

        console.log("Formatted phone number:", data.phone);

        const user = (await User.findOne({ phone: data.phone })) as IUser;
        if (!user) {
          const newUser = new User({
            phone: data.phone,
            preferences: [
              {
                scheduledTime: new Date(data.scheduledTime),
                status: "pending",
              },
            ],
          });
          await newUser.save();
          console.log("New user created:", newUser);
        } else {
          user.preferences.push({
            scheduledTime: new Date(data.scheduledTime),
            status: "pending",
          });
          await user.save();
          console.log("Existing user updated:", user);
        }
        socket.emit("callStatus", {
          status: "success",
          message: `Call scheduled for ${new Date(
            data.scheduledTime
          ).toLocaleString()}`,
        });
      } catch (error) {
        console.error("Detailed error scheduling call:", error);
        socket.emit("callStatus", {
          status: "error",
          message: "Failed to schedule call: " + (error as Error).message,
        });
      }
    }
  );

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Socket.IO server running on http://localhost:${PORT}`);
});

async function checkScheduledCalls() {
  try {
    const now = new Date();
    const users = (await User.find({
      preferences: {
        $elemMatch: {
          status: "pending",
          scheduledTime: { $lte: now },
        },
      },
    })) as IUser[];

    for (const user of users) {
      for (const call of user.preferences) {
        if (call.status === "pending" && call.scheduledTime <= now) {
          try {
            await makeCall(user.phone);
            call.status = "completed";
          } catch (error) {
            console.error("Error making scheduled call:", error);
            call.status = "failed";
          }
        }
      }
      await user.save();
    }
  } catch (error) {
    console.error("Error checking scheduled calls:", error);
  }
}

// Check scheduled calls every minute
setInterval(checkScheduledCalls, 1000);
