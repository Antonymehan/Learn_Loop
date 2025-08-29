const express = require("express");
const Learner = require("../models/Learner");
const User = require("../models/User");

const router = express.Router();

// Create or update learner profile
router.post("/", async (req, res) => {
  try {
    const { user_id, gender, areaOfInterest, goal, age } = req.body;

    if (!user_id) return res.status(400).json({ message: "User ID is required" });

    const user = await User.findById(user_id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Ensure gender matches enum
    const validGenders = ["Male", "Female", "Other"];
    const genderValue = validGenders.includes(gender) ? gender : "Other";

    // Check if learner exists
    let learner = await Learner.findOne({ user_id });

    if (learner) {
      learner.gender = genderValue;
      learner.areaOfInterest = areaOfInterest;
      learner.goal = goal;
      if (age) {
        learner.Age = age;
        user.age = age; // update user collection
        await user.save();
      }
      await learner.save();
      return res.json(learner);
    }

    // Create new learner
    learner = new Learner({
      user_id,
      gmail: user.gmail,
      Age: age || user.age,
      gender: genderValue,
      areaOfInterest,
      goal,
    });

    if (age) {
      user.age = age;
      await user.save();
    }

    await learner.save();
    res.status(201).json(learner);
  } catch (err) {
    console.error("POST /learners error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// Update Learner Age Only
router.put("/update-age/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { age } = req.body;

    if (!age) return res.status(400).json({ message: "Age is required" });

    const learner = await Learner.findOne({ user_id: userId });
    if (!learner) return res.status(404).json({ message: "Learner not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    learner.Age = age;
    user.age = age;

    await learner.save();
    await user.save();

    res.json({ message: "Age updated successfully", learner, user });
  } catch (err) {
    console.error("PUT /learners/update-age/:userId error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// Delete Account
router.delete("/delete/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Delete learner profile if exists
    await Learner.findOneAndDelete({ user_id: userId });

    // Delete user
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Account and profile deleted successfully" });
  } catch (err) {
    console.error("DELETE /learners/delete/:userId error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// Get learner by userId
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const learner = await Learner.findOne({ user_id: userId }).populate(
      "user_id",
      "name profile role age gmail"
    );

    if (!learner) return res.status(404).json({ message: "Learner not found" });

    res.json(learner);
  } catch (err) {
    console.error("GET /learners/:userId error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// Get all learners
router.get("/", async (req, res) => {
  try {
    const learners = await Learner.find().populate("user_id", "name profile role age gmail");
    res.json(learners);
  } catch (err) {
    console.error("GET /learners error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

module.exports = router;
