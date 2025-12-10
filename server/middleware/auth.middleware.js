// server/middleware/auth.js

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_for_testing";

// --- 1. Middleware to verify JWT and extract user data ---
const protect = (req, res, next) => {
  // 1. Check for token in the 'Authorization' header
  let token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied." });
  }

  // Check if the format is "Bearer <token>"
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length).trimLeft();
  } else {
    return res
      .status(401)
      .json({ message: "Token format must be Bearer <token>." });
  }

  // 2. Verify the token
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Attach the user data (id, role) from the token payload to the request
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid." });
  }
};

// --- 2. Middleware to check for Admin role (requires 'protect' first) ---
const isAdmin = (req, res, next) => {
  // Check if req.user exists (meaning 'protect' ran successfully) AND if the role is 'admin'
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Forbidden. Admin access required." });
  }
};

module.exports = { protect, isAdmin };
