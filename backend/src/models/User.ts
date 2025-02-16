import mongoose, { Schema, Document } from "mongoose";

interface IScheduledCall {
  scheduledTime: Date;
  status: "pending" | "completed" | "failed";
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: false },
  email: { type: String, required: false },
  phone: { type: String, required: true },
  password: { type: String, required: false },
  preferences: [
    {
      scheduledTime: { type: Date, required: true },
      status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
      },
    },
  ],
});

const User = mongoose.model("User", UserSchema);

export default User;
