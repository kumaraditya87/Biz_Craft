import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
// Import models
import User from "./models/User.js";
dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
    ],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/bizcraft",
    );
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📁 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/users/dashboard", dashboardRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/admin", adminRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("🚀 BizCraft Backend Running ✅");
});

// Create demo user route
app.post("/api/create-demo-user", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: "demo@bizcraft.com" });
    if (existingUser) {
      return res.json({
        message: "Demo user already exists",
        user: {
          id: existingUser._id,
          email: existingUser.email,
          name: existingUser.name,
        },
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("demo123", salt);

    const user = await User.create({
      name: "Demo User",
      email: "demo@bizcraft.com",
      password: hashedPassword,
      phone: "+1 (555) 123-4567",
      location: "New York, USA",
      department: "Engineering",
      position: "Senior Developer",
      bio: "Passionate about building great products and solving complex problems.",
      expertise: ["React", "Node.js", "TypeScript", "UI/UX"],
      languages: ["English", "Spanish"],
      social: {
        github: "demouser",
        linkedin: "demo-user",
        twitter: "@demouser",
      },
      role: "user",
    });

    console.log("✅ Demo user created successfully");
    res.json({
      message: "Demo user created successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("❌ Error creating demo user:", error);
    res.status(500).json({ message: "Error creating demo user" });
  }
});

// Reset database route
app.post("/api/reset-db", async (req, res) => {
  try {
    await User.deleteMany({});
    console.log("🗑️ All users deleted");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("demo123", salt);

    const user = await User.create({
      name: "Demo User",
      email: "demo@bizcraft.com",
      password: hashedPassword,
      phone: "+1 (555) 123-4567",
      location: "New York, USA",
      department: "Engineering",
      position: "Senior Developer",
      bio: "Passionate about building great products and solving complex problems.",
      expertise: ["React", "Node.js", "TypeScript", "UI/UX"],
      languages: ["English", "Spanish"],
      social: {
        github: "demouser",
        linkedin: "demo-user",
        twitter: "@demouser",
      },
      role: "user",
    });

    console.log("✅ Database reset and demo user created");
    res.json({
      message: "Database reset and demo user created",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("❌ Error resetting database:", error);
    res.status(500).json({ message: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 API endpoints:`);
  console.log(`   - GET  /`);
  console.log(`   - POST /api/auth/register`);
  console.log(`   - POST /api/auth/login`);
  console.log(`   - GET  /api/auth/verify`);
  console.log(`   - GET  /api/user/profile`);
  console.log(`   - PUT  /api/user/profile`);
  console.log(`   - GET  /api/user/stats`);
  console.log(`   - POST /api/user/change-password`);
  console.log(`   - POST /api/create-demo-user`);
  console.log(`   - POST /api/reset-db`);
  console.log(`   - GET  /api/protected`);
});
