const express = require("express");
const Tutor = require("../models/Tutor");
const User = require("../models/User");

const router = express.Router();

/**
 * Create or Update Tutor Profile
 */
router.post("/", async (req, res) => {
  try {
    const { user_id, domain, professional, workExperience, age } = req.body;

    if (!user_id) return res.status(400).json({ message: "User ID is required" });

    const user = await User.findById(user_id);
    if (!user) return res.status(404).json({ message: "User not found!" });

    let tutor = await Tutor.findOne({ user_id });

    if (tutor) {
      tutor.domain = domain || tutor.domain;
      tutor.professional = professional || tutor.professional;
      tutor.workExperience = workExperience || tutor.workExperience;
      if (age) {
        tutor.age = age;
        user.age = age;
        await user.save();
      }
      await tutor.save();
      return res.json(tutor);
    }

    // Create new tutor
    tutor = new Tutor({
      user_id,
      age: age || user.age,
      domain,
      professional,
      workExperience,
    });

    if (age) {
      user.age = age;
      await user.save();
    }

    await tutor.save();
    res.status(201).json(tutor);
  } catch (err) {
    console.error("POST /tutors error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

/**
 * Update Tutor Age Only
 */
router.put("/update-age/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { age } = req.body;

    if (!age) return res.status(400).json({ message: "Age is required" });

    const tutor = await Tutor.findOne({ user_id: userId });
    if (!tutor) return res.status(404).json({ message: "Tutor not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    tutor.age = age;
    user.age = age;

    await tutor.save();
    await user.save();

    res.json({ message: "Age updated successfully", tutor, user });
  } catch (err) {
    console.error("PUT /tutors/update-age/:userId error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

/**
 * Delete Account
 */
router.delete("/delete/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Delete Tutor profile if exists
    await Tutor.findOneAndDelete({ user_id: userId });

    // Delete User
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Account and profile deleted successfully" });
  } catch (err) {
    console.error("DELETE /delete/:userId error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

/**
 * Get all tutors
 */
router.get("/", async (req, res) => {
  try {
    const tutors = await Tutor.find().populate("user_id", "name gmail role age");
    res.json(tutors);
  } catch (err) {
    console.error("GET /tutors error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

/**
 * Get tutor by userId
 */
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const tutor = await Tutor.findOne({ user_id: userId }).populate(
      "user_id",
      "name gmail role age"
    );
    if (!tutor) return res.status(404).json({ message: "Tutor not found" });
    res.json(tutor);
  } catch (err) {
    console.error("GET /tutors/:userId error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

module.exports = router;
