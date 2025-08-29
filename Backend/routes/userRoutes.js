const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// ✅ Register
router.post("/register", async (req, res) => {
  try {
    const { name, gmail, password, profile, age, role } = req.body;

    // Check required fields
    if (!name || !gmail || !password || !age || !role)
      return res.status(400).json({ message: "All fields are required" });

    // Check if user exists
    const existingUser = await User.findOne({ gmail });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      name,
      gmail,
      password: hashedPassword,
      profile,
      age,
      role,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        gmail: newUser.gmail,
        profile: newUser.profile,
        age: newUser.age,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// ✅ Login
router.post("/login", async (req, res) => {
  try {
    const { gmail, password } = req.body;
    const user = await User.findOne({ gmail });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        gmail: user.gmail,
        profile: user.profile,
        age: user.age,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

module.exports = router;
