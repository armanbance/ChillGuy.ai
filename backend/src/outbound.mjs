import fastifyFormBody from "@fastify/formbody";
import fastifyWs from "@fastify/websocket";
import dotenv from "dotenv";
import Fastify from "fastify";
import fastifyCors from "@fastify/cors"; // Add CORS support
import Twilio from "twilio";
import WebSocket from "ws";
import mongoose from "mongoose";
import User from "./models/User.js";

// Load environment variables from .env file
dotenv.config();
console.log("TEST");

// Check for required environment variables

const MONGODB_URI =
  process.env.MONGODB_URI ||
  ""
; //ADDDDDD HEREEEEEE

console.log("MONGODB_URI:", MONGODB_URI);
mongoose.set("strictQuery", false);
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

if (
  !ELEVENLABS_API_KEY ||
  !ELEVENLABS_AGENT_ID ||
  !TWILIO_ACCOUNT_SID ||
  !TWILIO_AUTH_TOKEN ||
  !TWILIO_PHONE_NUMBER
) {
  console.error("Missing required environment variables");
  throw new Error("Missing required environment variables");
}

// Initialize Fastify server
const fastify = Fastify();
fastify.register(fastifyFormBody);
fastify.register(fastifyWs);
fastify.register(fastifyCors, {
  origin: "*", // Adjust this to restrict access to only your frontend
  methods: ["POST", "GET"],
});

const PORT = process.env.PORT || 8000;

// Root route for health check
fastify.get("/", async (_, reply) => {
  reply.send({ message: "Server is running" });
});

// Initialize Twilio client
const twilioClient = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

async function checkScheduledCalls() {
  try {
    const now = new Date();
    const users = await User.find({
      preferences: {
        $elemMatch: {
          status: "pending",
          scheduledTime: { $lte: now },
        },
      },
    });

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
// Helper function to get signed URL for authenticated conversations
async function getSignedUrl() {
  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${ELEVENLABS_AGENT_ID}`,
      {
        method: "GET",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get signed URL: ${response.statusText}`);
    }

    const data = await response.json();
    return data.signed_url;
  } catch (error) {
    console.error("Error getting signed URL:", error);
    throw error;
  }
}

// Add these routes before server startup

// Schedule Call endpoint
fastify.post("/api/schedule-call", async (request, reply) => {
  console.log("REQ BODDDY:", request.body);
  try {
    let phone = request.body.phone;
    let scheduledTime = request.body.scheduledTime;
    let currentTime = new Date().toISOString();

    if (phone.startsWith("+")) {
      phone = "+1" + phone.replace(/\D/g, "");
    }

    console.log("Formatted phone number:", phone);

    const user = await User.findOne({ phone: phone });
    if (!user) {
      const newUser = new User({
        phone: phone,
        preferences: [
          {
            scheduledTime: new Date(scheduledTime),
            status: "pending",
          },
        ],
      });
      await newUser.save();
      console.log("New user created:", newUser);
    } else {
      user.preferences.push({
        scheduledTime: new Date(scheduledTime),
        status: "pending",
      });
      await user.save();
      console.log("Existing user updated:", user);
    }
    console.log("Schedule call request:", { phone, scheduledTime });

    // Format phone number
    // let formattedPhone = phone;
    // if (!formattedPhone.startsWith("+")) {
    //   formattedPhone = "+1" + formattedPhone.replace(/\D/g, "");
    // }

    // // Database operations
    // const user = await User.findOne({ phone: formattedPhone });
    // if (!user) {
    //   const newUser = new User({
    //     phone: formattedPhone,
    //     preferences: [
    //       {
    //         scheduledTime: new Date(scheduledTime),
    //         status: "pending",
    //       },
    //     ],
    //   });
    //   await newUser.save();
    //   console.log("New user created:", newUser);
    // } else {
    //   user.preferences.push({
    //     scheduledTime: new Date(scheduledTime),
    //     status: "pending",
    //   });
    //   await user.save();
    //   console.log("Existing user updated:", user);
    // }

    // reply.send({
    //   success: true,
    //   message: `Call scheduled for ${new Date(scheduledTime).toLocaleString()}`,
    // });
  } catch (error) {
    console.log("Detailed error scheduling call:", error);
    console.error("Error scheduling call:", error);
    reply.code(500).send({
      success: false,
      message: "Failed to schedule call: " + error.message,
    });
  }
});

// Save User endpoint
fastify.post("/api/users", async (request, reply) => {
  try {
    const userData = request.body;
    console.log("Save user request:", userData);

    const newUser = new User(userData);
    await newUser.save();

    reply.send({
      success: true,
      user: newUser,
    });
  } catch (error) {
    console.error("Error saving user:", error);
    reply.code(500).send({
      success: false,
      error: error.message,
    });
  }
});

// Signin endpoint
fastify.post("/api/signin", async (request, reply) => {
  try {
    const { email, password } = {
      email: request.body.email,
      password: request.body.password,
    };

    const user = await User.findOne({ email });

    if (!user) {
      reply.code(401).send({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    // Note: In production, use proper password hashing!
    if (user.password === password) {
      reply.send({
        success: true,
        user: {
          email: user.email,
          phone: user.phone,
          preferences: user.preferences,
        },
      });
    } else {
      reply.code(401).send({
        success: false,
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    console.error("Error during signin:", error);
    reply.code(500).send({
      success: false,
      message: "An error occurred during sign in",
    });
  }
});

// Route to initiate outbound calls
fastify.post("/outbound-call", async (request, reply) => {
  const { number, prompt, first_message } = request.body;
  console.log("IN OUTBOUND CALL");
  if (!number) {
    return reply.code(400).send({ error: "Phone number is required" });
  }

  try {
    const call = await twilioClient.calls.create({
      from: TWILIO_PHONE_NUMBER,
      to: number,
      url: `https://${
        request.headers.host
      }/outbound-call-twiml?prompt=${encodeURIComponent(
        prompt
      )}&first_message=${encodeURIComponent(first_message)}`,
    });

    reply.send({
      success: true,
      message: "Call initiated",
      callSid: call.sid,
    });
  } catch (error) {
    console.log("Error initiating outbound call:", error);
    reply.code(500).send({
      success: false,
      error: "Failed to initiate call",
    });
  }
});

// TwiML route for outbound calls
fastify.all("/outbound-call-twiml", async (request, reply) => {
  const prompt = request.query.prompt || "";
  const first_message = request.query.first_message || "";

  console.log("REQ HEADER:::", request.headers.host);
  const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
   <Response>
       <Connect>
       <Stream url="wss://${request.headers.host}/outbound-media-stream">
           <Parameter name="prompt" value="${prompt}" />
           <Parameter name="first_message" value="${first_message}" />
       </Stream>
       </Connect>
   </Response>`;

  reply.type("text/xml").send(twimlResponse);
});

// WebSocket route for handling media streams
fastify.register(async (fastifyInstance) => {
  fastifyInstance.get(
    "/outbound-media-stream",
    { websocket: true },
    (ws, req) => {
      console.info("[Server] Twilio connected to outbound media stream");

      // Variables to track the call
      let streamSid = null;
      let callSid = null;
      let elevenLabsWs = null;
      let customParameters = null; // Add this to store parameters

      // Handle WebSocket errors
      ws.on("error", console.error);

      // Set up ElevenLabs connection
      const setupElevenLabs = async () => {
        try {
          const signedUrl = await getSignedUrl();
          elevenLabsWs = new WebSocket(signedUrl);
          elevenLabsWs.on("open", () => {
            console.log("[ElevenLabs] Connected to Conversational AI");

            // Send initial configuration with prompt and first message
            const initialConfig = {
              type: "conversation_initiation_client_data",
              conversation_config_override: {
                agent: {
                  prompt: {
                    prompt:
                      customParameters?.prompt ||
                      "you are a gary from the phone store",
                  },
                  first_message:
                    customParameters?.first_message ||
                    "hey there! how can I help you today?",
                },
              },
            };

            console.log(
              "[ElevenLabs] Sending initial config with prompt:",
              initialConfig.conversation_config_override.agent.prompt.prompt
            );

            // Send the configuration to ElevenLabs
            elevenLabsWs.send(JSON.stringify(initialConfig));
          });

          elevenLabsWs.on("message", (data) => {
            try {
              const message = JSON.parse(data);

              switch (message.type) {
                case "conversation_initiation_metadata":
                  console.log("[ElevenLabs] Received initiation metadata");
                  break;

                case "audio":
                  if (streamSid) {
                    if (message.audio?.chunk) {
                      const audioData = {
                        event: "media",
                        streamSid,
                        media: {
                          payload: message.audio.chunk,
                        },
                      };
                      ws.send(JSON.stringify(audioData));
                    } else if (message.audio_event?.audio_base_64) {
                      const audioData = {
                        event: "media",
                        streamSid,
                        media: {
                          payload: message.audio_event.audio_base_64,
                        },
                      };
                      ws.send(JSON.stringify(audioData));
                    }
                  } else {
                    console.log(
                      "[ElevenLabs] Received audio but no StreamSid yet"
                    );
                  }
                  break;

                case "interruption":
                  if (streamSid) {
                    ws.send(
                      JSON.stringify({
                        event: "clear",
                        streamSid,
                      })
                    );
                  }
                  break;

                case "ping":
                  if (message.ping_event?.event_id) {
                    elevenLabsWs.send(
                      JSON.stringify({
                        type: "pong",
                        event_id: message.ping_event.event_id,
                      })
                    );
                  }
                  break;

                case "agent_response":
                  console.log(
                    `[Twilio] Agent response: ${message.agent_response_event?.agent_response}`
                  );
                  break;

                case "user_transcript":
                  console.log(
                    `[Twilio] User transcript: ${message.user_transcription_event?.user_transcript}`
                  );
                  break;

                default:
                  console.log(
                    `[ElevenLabs] Unhandled message type: ${message.type}`
                  );
              }
            } catch (error) {
              console.error("[ElevenLabs] Error processing message:", error);
            }
          });

          elevenLabsWs.on("error", (error) => {
            console.error("[ElevenLabs] WebSocket error:", error);
          });

          elevenLabsWs.on("close", () => {
            console.log("[ElevenLabs] Disconnected");
          });
        } catch (error) {
          console.error("[ElevenLabs] Setup error:", error);
        }
      };

      // Set up ElevenLabs connection
      setupElevenLabs();

      // Handle messages from Twilio
      ws.on("message", (message) => {
        try {
          const msg = JSON.parse(message);
          if (msg.event !== "media") {
            console.log(`[Twilio] Received event: ${msg.event}`);
          }

          switch (msg.event) {
            case "start":
              streamSid = msg.start.streamSid;
              callSid = msg.start.callSid;
              customParameters = msg.start.customParameters; // Store parameters
              console.log(
                `[Twilio] Stream started - StreamSid: ${streamSid}, CallSid: ${callSid}`
              );
              console.log("[Twilio] Start parameters:", customParameters);
              break;

            case "media":
              if (elevenLabsWs?.readyState === WebSocket.OPEN) {
                const audioMessage = {
                  user_audio_chunk: Buffer.from(
                    msg.media.payload,
                    "base64"
                  ).toString("base64"),
                };
                elevenLabsWs.send(JSON.stringify(audioMessage));
              }
              break;

            case "stop":
              console.log(`[Twilio] Stream ${streamSid} ended`);
              if (elevenLabsWs?.readyState === WebSocket.OPEN) {
                elevenLabsWs.close();
              }
              break;

            default:
              console.log(`[Twilio] Unhandled event: ${msg.event}`);
          }
        } catch (error) {
          console.error("[Twilio] Error processing message:", error);
        }
      });

      // Handle WebSocket closure
      ws.on("close", () => {
        console.log("[Twilio] Client disconnected");
        if (elevenLabsWs?.readyState === WebSocket.OPEN) {
          elevenLabsWs.close();
        }
      });
    }
  );
});

// Start the Fastify server
fastify.listen({ port: PORT }, (err) => {
  if (err) {
    console.error("Error starting server:", err);
    process.exit(1);
  }
  console.log(`[Server] Listening on port ${PORT}`);
});
