const express = require("express");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const Lawyer = require("../models/lawyers");
const Client = require("../models/clients");

const router = express.Router();

const validation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", validation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await Lawyer.findOne({
      $or: [{ email }],
    });

    if (existingUser) {
      return res.status(400).json({
        message:
          existingUser.email === email
            ? "Email already registered"
            : "Username already taken",
      });
    }

    // Create new lawyer
    const lawyer = new Lawyer({
      email,
      password,
    });

    await lawyer.save();

    // Generate token
    const token = generateToken(lawyer._id);

    res.status(201).json({
      message: "Lawyer registered successfully",
      token,
      lawyer: {
        id: lawyer._id,
        email: lawyer.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", validation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find lawyer by email and populate assigned clients with full details
    const lawyer = await Lawyer.findOne({ email }).populate({
      path: "assigned_clients",
      model: "Client",
    });

    if (!lawyer) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await lawyer.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(lawyer._id);

    res.json({
      message: "Login successful",
      token,
      lawyer: {
        id: lawyer._id,
        email: lawyer.email,
        assigned_clients: lawyer.assigned_clients,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

module.exports = router;
