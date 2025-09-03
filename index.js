const express = require("express");
const request = require("request");

const mongoose = require("mongoose");
// const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require("./routes/auth");
const lawyerProfile = require("./routes/profile");

// Import middleware
const { requestLogger } = require("./middleware/log");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const allowedOrigins = ["http://localhost:3000", "http://192.168.1.133:3000"];

app.use((req, res, next) => {
  const origin = req.headers.origin; // Get the origin from the request

  // Check if the origin is in the allowed list
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin); // Set the specific origin
  } else {
    // Optionally, handle unauthorized origins (e.g., deny or set a default)
    // res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // Fallback
  }

  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       // Allow requests with no origin (e.g., Postman or curl) or allowed origins
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use(requestLogger);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/lawyers", lawyerProfile);

// Basic route
app.get("/", (req, res) => {
  res.json({
    message: "Express MongoDB Server is running!",
    endpoints: {
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
      },
      lawyers: {
        profile: "GET /api/lawyers/profile",
      },
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  // Database connection
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to MongoDB");
      console.log(`Server is running on port ${PORT}`);
    })
    .catch((error) => console.error("MongoDB connection error:", error));
});

module.exports = app;
