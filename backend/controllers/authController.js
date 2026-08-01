// backend/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Register user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone: "",
      location: "",
      department: "",
      position: "",
      bio: "",
      expertise: [],
      languages: ["English"],
      social: {
        github: "",
        linkedin: "",
        twitter: "",
      },
      role: "user",
    });

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    console.log(`✅ User registered: ${email}`);
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        department: user.department,
        position: user.position,
        bio: user.bio,
        expertise: user.expertise,
        languages: user.languages,
        social: user.social,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(`🔑 Login attempt: ${email}`);

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`❌ User not found: ${email}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`❌ Invalid password for: ${email}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    console.log(`✅ Login successful: ${email}`);
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        department: user.department,
        position: user.position,
        bio: user.bio,
        expertise: user.expertise,
        languages: user.languages,
        social: user.social,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

// Verify token
export const verifyToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        department: user.department,
        position: user.position,
        bio: user.bio,
        expertise: user.expertise,
        languages: user.languages,
        social: user.social,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Get user profile (for auth routes)
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      location: user.location,
      department: user.department,
      position: user.position,
      bio: user.bio,
      expertise: user.expertise,
      languages: user.languages,
      social: user.social,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};
