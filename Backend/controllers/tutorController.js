const Tutor = require("../models/Tutor");
const User = require("../models/User");

// Create or Update Tutor Profile
exports.createOrUpdateTutor = async (req, res) => {
  try {
    const { user_id, age, domain, professional, workExperience } = req.body;
    const user = await User.findById(user_id);

    if (!user || user.role !== "tutor") {
      return res.status(400).json({ message: "Invalid user or role" });
    }

    // Check if tutor profile exists
    let tutor = await Tutor.findOne({ user: user._id });

    if (tutor) {
      // Update existing profile
      tutor.age = age;
      tutor.domain = domain;
      tutor.professional = professional;
      tutor.workExperience = workExperience;
      await tutor.save();
      return res.status(200).json({ tutor, message: "Tutor profile updated" });
    }

    // Create new profile
    tutor = new Tutor({ user: user._id, age, domain, professional, workExperience });
    await tutor.save();
    res.status(201).json({ tutor, message: "Tutor profile created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Tutor Profile by User ID
exports.getTutorByUserId = async (req, res) => {
  try {
    const tutor = await Tutor.findOne({ user: req.params.id }).populate("user", "name age email");
    if (!tutor) return res.status(404).json({ message: "Tutor profile not found" });
    res.json(tutor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Tutor Profile and User Account
exports.deleteTutor = async (req, res) => {
  try {
    const tutor = await Tutor.findOneAndDelete({ user: req.params.id });
    if (!tutor) return res.status(404).json({ message: "Tutor profile not found" });

    // Delete the user account as well
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "Tutor account deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
