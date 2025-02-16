const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: false },
  email: { type: String, required: false, sparse: true },
  phone: { type: String, required: true },
  password: { type: String, required: false },
  preferences: [
    {
      scheduledTime: { type: String, required: true },
      status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
      },
      prompt: { type: String },
      first_message: { type: String },
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
