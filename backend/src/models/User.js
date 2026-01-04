import mongoose from "mongoose";
const userSchema = mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  avatarUrl: { type: String , default: "" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);