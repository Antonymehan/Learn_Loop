const Learner = require("../models/Learner");
const User = require("../models/User");

// Create learner profile
exports.createLearner = async (req, res) => {
  try {
    const { user_id, age, interest } = req.body;
    const user = await User.findById(user_id);

    if (!user || user.role !== "learner") {
      return res.status(400).json({ message: "Invalid user or role" });
    }

    const existing = await Learner.findOne({ user: user._id });
    if (existing) return res.status(409).json({ message: "Learner profile already exists" });

    const learner = new Learner({ user: user._id, age, interest });
    await learner.save();

    res.status(201).json({ learner });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update learner profile
exports.updateLearner = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { age, interest } = req.body;

    const learner = await Learner.findOne({ user: userId });
    if (!learner) return res.status(404).json({ message: "Learner profile not found" });

    learner.age = age || learner.age;
    learner.interest = interest || learner.interest;

    await learner.save();
    res.status(200).json({ message: "Profile updated successfully", learner });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get learner profile
exports.getLearnerByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const learner = await Learner.findOne({ user: userId }).populate("user", "-password");
    if (!learner) return res.status(404).json({ message: "Learner profile not found" });

    res.status(200).json(learner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
