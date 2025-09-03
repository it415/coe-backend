const express = require("express");
const dotenv = require("dotenv");
// Import routes
const authRoutes = require("./routes/auth");
const lawyerProfile = require("./routes/profile");
// Import middleware
const { requestLogger } = require("./middleware/log");
const { connectDBMiddleware, corsMiddleware } = require("./middleware/utils");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(connectDBMiddleware);

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

// Start server for local dev (optional, not needed in Vercel)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
