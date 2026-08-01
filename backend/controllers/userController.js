// backend/controllers/userController.js
import bcrypt from "bcryptjs";
import User from "../models/User.js";

// Get user profile
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

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields
    user.name = req.body.name || user.name;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.location =
      req.body.location !== undefined ? req.body.location : user.location;
    user.department =
      req.body.department !== undefined ? req.body.department : user.department;
    user.position =
      req.body.position !== undefined ? req.body.position : user.position;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
    user.expertise = req.body.expertise || user.expertise;
    user.languages = req.body.languages || user.languages;

    // Update social fields
    if (req.body.social) {
      user.social = {
        github:
          req.body.social.github !== undefined
            ? req.body.social.github
            : user.social.github,
        linkedin:
          req.body.social.linkedin !== undefined
            ? req.body.social.linkedin
            : user.social.linkedin,
        twitter:
          req.body.social.twitter !== undefined
            ? req.body.social.twitter
            : user.social.twitter,
      };
    }

    const updatedUser = await user.save();

    res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      location: updatedUser.location,
      department: updatedUser.department,
      position: updatedUser.position,
      bio: updatedUser.bio,
      expertise: updatedUser.expertise,
      languages: updatedUser.languages,
      social: updatedUser.social,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
    });
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

// Get user stats
export const getUserStats = async (req, res) => {
  try {
    // You can customize these stats based on your app's data
    // For now, returning mock stats
    res.json({
      projects: "24",
      contributions: "156",
      connections: "342",
      badges: "12",
    });
  } catch (error) {
    console.error("❌ Error fetching stats:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("❌ Error changing password:", error);
    res.status(500).json({ message: "Failed to change password" });
  }
};

// Get user dashboard items
export const getDashboardItems = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.dashboardItems || { guides: [], suppliers: [], tools: [], calculators: [] });
  } catch (error) {
    console.error("❌ Error fetching dashboard items:", error);
    res.status(500).json({ message: "Failed to fetch dashboard items" });
  }
};

// Update user dashboard items
export const updateDashboardItems = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure all categories exist even if not provided in the request
    const currentItems = user.dashboardItems || { guides: [], suppliers: [], tools: [], calculators: [] };
    const newItems = req.body || {};
    
    user.dashboardItems = {
      guides: newItems.guides || currentItems.guides || [],
      suppliers: newItems.suppliers || currentItems.suppliers || [],
      tools: newItems.tools || currentItems.tools || [],
      calculators: newItems.calculators || currentItems.calculators || []
    };
    
    await user.save();

    res.json(user.dashboardItems);
  } catch (error) {
    console.error("❌ Error updating dashboard items:", error);
    res.status(500).json({ message: "Failed to update dashboard items" });
  }
};
