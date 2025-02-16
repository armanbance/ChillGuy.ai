import mongoose, { Schema, Document } from "mongoose";

const UserSchema: Schema = new Schema({
  name: { type: String, required: false },
  email: { type: String, required: false, unique: false },
  password: { type: String, required: false },
  preferences: { type: [String], default: [] },
  phone: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);

export default User;
