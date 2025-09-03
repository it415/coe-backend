const jwt = require("jsonwebtoken");
const Lawyer = require("../models/lawyers");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Access token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const lawyer = await Lawyer.findById(decoded.userId).select("-password");

    if (!lawyer) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = lawyer;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

const adminAuth = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access required" });
  }
};

module.exports = { auth, adminAuth };
