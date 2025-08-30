const Session = require("../models/Session");
const Tutor = require("../models/Tutor");
const Learner = require("../models/Learner");

// Create session (tutor only)
exports.createSession = async (req, res) => {
  try {
    const { tutor_id, title, description, date, time } = req.body;
    const tutor = await Tutor.findById(tutor_id);
    if (!tutor) return res.status(400).json({ message: "Invalid tutor" });

    const session = new Session({ tutor: tutor._id, title, description, date, time });
    await session.save();

    res.status(201).json({ session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get sessions for a tutor
exports.getTutorSessions = async (req, res) => {
  try {
    const { tutorId } = req.params;
    const sessions = await Session.find({ tutor: tutorId })
      .populate({ path: "tutor", populate: { path: "user", select: "name email" } })
      .sort({ date: 1 });
    res.status(200).json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all sessions for learners
exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate({ path: "tutor", populate: { path: "user", select: "name email" } })
      .sort({ date: 1 });
    res.status(200).json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Register learner for a session
exports.registerLearner = async (req, res) => {
  try {
    const { sessionId, learnerId } = req.body;

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    const learner = await Learner.findOne({ user: learnerId });
    if (!learner) return res.status(404).json({ message: "Learner not found" });

    if (!session.learners.includes(learner._id)) {
      session.learners.push(learner._id);
      await session.save();
    }

    res.status(200).json({ message: "Registered successfully", session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Unregister learner from a session
exports.unregisterLearner = async (req, res) => {
  try {
    const { sessionId, learnerId } = req.body;

    const session = await Session.findById(sessionId);
    const learner = await Learner.findOne({ user: learnerId });

    if (!session || !learner)
      return res.status(404).json({ message: "Session or learner not found" });

    session.learners = session.learners.filter(
      (id) => id.toString() !== learner._id.toString()
    );
    await session.save();

    res.status(200).json({ message: "Unregistered successfully", session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get sessions registered by a learner
exports.getLearnerSessions = async (req, res) => {
  try {
    const { learnerId } = req.params;

    const learner = await Learner.findOne({ user: learnerId });
    if (!learner) return res.status(404).json({ message: "Learner not found" });

    const sessions = await Session.find({ learners: learner._id })
      .populate({ path: "tutor", populate: { path: "user", select: "name email" } })
      .sort({ date: 1 });

    res.status(200).json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete session (tutor only)
exports.deleteSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    await session.deleteOne();
    res.status(200).json({ message: "Session deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
