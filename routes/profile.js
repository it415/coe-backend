const express = require("express");
const { auth } = require("../middleware/auth");
const Lawyer = require("../models/lawyers");

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get("/profile", auth, async (req, res) => {
  try {
    res.json({
      message: "Profile retrieved successfully",
      user: req.user,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID (Admin only)
// @access  Private/Admin
router.get("/:id", auth, async (req, res) => {
  try {
    const user = await Lawyer.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User retrieved successfully",
      user,
    });
  } catch (error) {
    console.error("User fetch error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
