// backend/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: "" },
  location: { type: String, default: "" },
  department: { type: String, default: "" },
  position: { type: String, default: "" },
  bio: { type: String, default: "" },
  expertise: [{ type: String }],
  languages: [{ type: String }],
  social: {
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    twitter: { type: String, default: "" },
  },
  dashboardItems: {
    guides: { type: Array, default: [] },
    suppliers: { type: Array, default: [] },
    tools: { type: Array, default: [] },
    calculators: { type: Array, default: [] }
  },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

export default User;
