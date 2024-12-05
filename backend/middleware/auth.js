const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, "secretKey"); // Decode token
    req.user = {
      id: decoded.id, // Assign user ID
      role: decoded.role,
    };
    next();
  } catch (error) {
    console.error("Token Verification Error:", error); // Debug log for errors
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Middleware for role-based authorization
const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

module.exports = { authenticateUser, authorizeRole };
