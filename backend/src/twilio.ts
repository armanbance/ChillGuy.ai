import dotenv from "dotenv";
// import express from "express";
// import cors from "cors";
dotenv.config();
var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;

var client = require("twilio")(accountSid, authToken);

async function makeCall() {
  try {
    const call = await client.calls.create({
      twiml:
        "<Response><Say>Hey, it's ChillGuy Dot A I. I'm calling to check in on you. How are you doing today?</Say></Response>",
      to: "+14089604093",
      from: "+17432508492",
    });

    console.log("Call initiated with SID:", call.sid);
    return call.sid;
  } catch (error) {
    console.error("Twilio call error:", error);
    throw error;
  }
}

export default makeCall;
