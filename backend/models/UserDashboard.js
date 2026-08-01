// backend/models/UserDashboard.js
import mongoose from "mongoose";

const userDashboardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    guides: [
      {
        id: mongoose.Schema.Types.Mixed,
        title: String,
        category: String,
        author: String,
        reads: Number,
        status: String,
        addedAt: { type: Date, default: Date.now },
      },
    ],
    suppliers: [
      {
        id: mongoose.Schema.Types.Mixed,
        name: String,
        category: String,
        location: String,
        rating: Number,
        status: String,
        addedAt: { type: Date, default: Date.now },
      },
    ],
    tools: [
      {
        id: mongoose.Schema.Types.Mixed,
        name: String,
        category: String,
        rating: Number,
        usage: Number,
        status: String,
        addedAt: { type: Date, default: Date.now },
      },
    ],
    calculators: [
      {
        id: mongoose.Schema.Types.Mixed,
        name: String,
        description: String,
        type: String,
        addedAt: { type: Date, default: Date.now },
      },
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { strict: false },
);

const UserDashboard = mongoose.model("UserDashboard", userDashboardSchema);

export default UserDashboard;
