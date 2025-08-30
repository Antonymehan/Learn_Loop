// controllers/sessionController.js
const Session = require("../models/Session");
const Tutor = require("../models/Tutor");
const Learner = require("../models/Learner");

// ----------------- CREATE SESSION -----------------
exports.createSession = async (req, res) => {
  try {
    const { tutor_id, title, description, date, time } = req.body;

    const tutor = await Tutor.findById(tutor_id);
    if (!tutor) return res.status(400).json({ message: "Invalid tutor" });

    const session = new Session({
      tutor: tutor._id,
      title,
      description,
      date,
      time,
    });
    await session.save();

    res.status(201).json({ message: "Session created successfully", session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------- GET TUTOR SESSIONS -----------------
exports.getTutorSessions = async (req, res) => {
  try {
    const { tutorId } = req.params;
    const sessions = await Session.find({ tutor: tutorId })
      .populate({
        path: "tutor",
        populate: { path: "user", select: "name email" },
      })
      .sort({ date: 1 });

    res.status(200).json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------- GET ALL SESSIONS -----------------
exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate({
        path: "tutor",
        populate: { path: "user", select: "name email" },
      })
      .sort({ date: 1 });

    res.status(200).json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------- REGISTER LEARNER -----------------
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

// ----------------- UNREGISTER LEARNER -----------------
exports.unregisterLearner = async (req, res) => {
  try {
    const { sessionId, learnerId } = req.body;

    const session = await Session.findById(sessionId);
    const learner = await Learner.findOne({ user: learnerId });

    if (!session || !learner) {
      return res.status(404).json({ message: "Session or learner not found" });
    }

    session.learners = session.learners.filter(
      (id) => id.toString() !== learner._id.toString()
    );
    await session.save();

    res.status(200).json({ message: "Unregistered successfully", session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------- GET LEARNER SESSIONS -----------------
exports.getLearnerSessions = async (req, res) => {
  try {
    const { learnerId } = req.params;

    const learner = await Learner.findOne({ user: learnerId });
    if (!learner) return res.status(404).json({ message: "Learner not found" });

    const sessions = await Session.find({ learners: learner._id })
      .populate({
        path: "tutor",
        populate: { path: "user", select: "name email" },
      })
      .sort({ date: 1 });

    res.status(200).json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------- DELETE SESSION -----------------
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

// ----------------- START MEETING (Tutor) -----------------
exports.startMeeting = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    // Generate unique Jitsi meeting link
    const meetingLink = `https://meet.jit.si/${id}-${Date.now()}`;

    session.meetingLink = meetingLink;
    session.status = "Ongoing"; // mark session as ongoing
    await session.save();

    res.status(200).json({
      message: `Session "${session.title}" started!`,
      meetingLink,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------- JOIN MEETING (Learner) -----------------
exports.joinMeeting = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (!session.meetingLink) {
      return res.status(400).json({ message: "Meeting not started yet by tutor" });
    }

    res.status(200).json({
      message: `Joining session "${session.title}"`,
      meetingLink: session.meetingLink,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------- END MEETING (Tutor) -----------------
exports.endMeeting = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    session.status = "Completed";
    await session.save();

    res.status(200).json({ message: `Session "${session.title}" ended.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
