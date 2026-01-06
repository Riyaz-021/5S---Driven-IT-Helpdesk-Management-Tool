const express = require("express");
const router = express.Router();
const ContactInfo = require("../models/ContactInfo.js");
const User = require("../models/Users.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

/* Index Page */
router.get("/", (req, res) => {
  res.json({ message: "Welcome to the HelpDesk API" });
});

/* Contact Page */
router.post("/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const newContact = new ContactInfo({ name, email, subject, message });
    await newContact.save();

    res
      .status(201)
      .json({ message: "Contact information saved successfully!" });
  } catch (error) {
    console.error("Error saving contact information:", error);
    res.status(500).json({ error: "Failed to save contact information" });
  }
});

/* Login Page */
router.get("/login", (req, res) => {
  res.json({ message: "Please POST to this endpoint to log in" });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role }, // Ensure id is included
      "secretKey", // Replace with a secure key
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 3600000,
    });

    res.json({ message: "Login successful", role: user.role });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

/* User Logout */
router.get("/logout", (req, res) => {
  res.cookie("token", "", { maxAge: 0, httpOnly: true });
  res.set("Cache-Control", "no-store");
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
      }
    });
  }
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
