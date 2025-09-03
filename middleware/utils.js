const mongoose = require("mongoose");

// Middleware to ensure MongoDB connection
const connectDBMiddleware = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return next(); // Reuse existing connection
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 30s timeout
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10, // Suitable for low traffic
      bufferCommands: false, // Prevent buffering timeout
    });
    console.log("Connected to MongoDB");
    next();
  } catch (error) {
    console.error("MongoDB connection error:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
};

// CORS Middleware
const corsMiddleware = (req, res, next) => {
  const allowedOrigins = ["http://localhost:5001", "https://coe.lineablu.com"];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin) || true) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
};

module.exports = { connectDBMiddleware, corsMiddleware };
