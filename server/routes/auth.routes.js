const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "jwtsecretkey";
const saltRounds = 10;

router.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Default role is 'user', unless explicitly set to 'admin' (can be restricted later)
    const userRole = role === "admin" ? "admin" : "user";

    const sql =
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";
    const [result] = await db.query(sql, [
      username,
      email,
      hashedPassword,
      userRole,
    ]);

    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId,
      role: userRole,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ message: "Email or username already exists." });
    }
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Registration failed." });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const user = users[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Login failed." });
  }
});

module.exports = router;
