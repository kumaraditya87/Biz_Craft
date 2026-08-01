// backend/controllers/dashboardController.js
import UserDashboard from "../models/UserDashboard.js";

// Get user's dashboard items
export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("📊 Fetching dashboard for user:", userId);

    let dashboard = await UserDashboard.findOne({ userId });

    // If no dashboard exists, create an empty one
    if (!dashboard) {
      console.log("🆕 Creating new empty dashboard");
      dashboard = await UserDashboard.create({
        userId,
        guides: [],
        suppliers: [],
        tools: [],
        calculators: [],
      });
    }

    res.json({
      guides: dashboard.guides,
      suppliers: dashboard.suppliers,
      tools: dashboard.tools,
      calculators: dashboard.calculators,
    });
  } catch (error) {
    console.error("❌ Error fetching user dashboard:", error.message);
    console.error("Stack:", error.stack);
    res.status(500).json({
      message: "Failed to fetch dashboard",
      error: error.message,
    });
  }
};

// Update user's dashboard items
export const updateUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const { guides, suppliers, tools, calculators } = req.body;

    console.log("📊 Updating dashboard for user:", userId);
    console.log("📦 Received data:", { guides, suppliers, tools, calculators });

    let dashboard = await UserDashboard.findOne({ userId });

    if (!dashboard) {
      dashboard = await UserDashboard.create({
        userId,
        guides: guides || [],
        suppliers: suppliers || [],
        tools: tools || [],
        calculators: calculators || [],
      });
      console.log("✅ Created new dashboard");
    } else {
      dashboard.guides = guides || dashboard.guides;
      dashboard.suppliers = suppliers || dashboard.suppliers;
      dashboard.tools = tools || dashboard.tools;
      dashboard.calculators = calculators || dashboard.calculators;
      dashboard.updatedAt = new Date();
      await dashboard.save();
      console.log("✅ Updated existing dashboard");
    }

    res.json({
      message: "Dashboard updated successfully",
      guides: dashboard.guides,
      suppliers: dashboard.suppliers,
      tools: dashboard.tools,
      calculators: dashboard.calculators,
    });
  } catch (error) {
    console.error("❌ Error updating user dashboard:", error.message);
    console.error("Stack:", error.stack);
    res.status(500).json({
      message: "Failed to update dashboard",
      error: error.message,
    });
  }
};

// Add item to dashboard
export const addToDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, item } = req.body;

    console.log("➕ Adding to dashboard - Type:", type, "Item:", item);

    // Validate item type
    if (!["guides", "suppliers", "tools", "calculators"].includes(type)) {
      return res.status(400).json({ message: "Invalid item type" });
    }

    let dashboard = await UserDashboard.findOne({ userId });

    if (!dashboard) {
      dashboard = await UserDashboard.create({
        userId,
        [type]: [{ ...item, addedAt: new Date() }],
        guides: [],
        suppliers: [],
        tools: [],
        calculators: [],
      });
      console.log("✅ Created new dashboard with item");
    } else {
      // Check if item already exists
      const itemExists = dashboard[type].some(
        (existingItem) => existingItem.id === item.id,
      );

      if (itemExists) {
        return res.status(400).json({ message: "Item already in dashboard" });
      }

      dashboard[type].push({ ...item, addedAt: new Date() });
      dashboard.updatedAt = new Date();
      await dashboard.save();
      console.log("✅ Added item to existing dashboard");
    }

    res.json({
      message: `${type.slice(0, -1)} added to dashboard`,
      [type]: dashboard[type],
    });
  } catch (error) {
    console.error("❌ Error adding to dashboard:", error.message);
    console.error("Stack:", error.stack);
    res.status(500).json({
      message: "Failed to add item to dashboard",
      error: error.message,
    });
  }
};

// Remove item from dashboard
export const removeFromDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, itemId } = req.body;

    console.log("➖ Removing from dashboard - Type:", type, "ItemId:", itemId);

    // Validate item type
    if (!["guides", "suppliers", "tools", "calculators"].includes(type)) {
      return res.status(400).json({ message: "Invalid item type" });
    }

    let dashboard = await UserDashboard.findOne({ userId });

    if (!dashboard) {
      return res.status(404).json({ message: "Dashboard not found" });
    }

    dashboard[type] = dashboard[type].filter((item) => item.id !== itemId);
    dashboard.updatedAt = new Date();
    await dashboard.save();

    console.log("✅ Removed item from dashboard");

    res.json({
      message: "Item removed from dashboard",
      [type]: dashboard[type],
    });
  } catch (error) {
    console.error("❌ Error removing from dashboard:", error.message);
    console.error("Stack:", error.stack);
    res.status(500).json({
      message: "Failed to remove item from dashboard",
      error: error.message,
    });
  }
};
