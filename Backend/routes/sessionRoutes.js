const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/sessionController");

// Tutor creates a session
router.post("/create", sessionController.createSession);

// Tutor views their sessions
router.get("/tutor/:tutorId", sessionController.getTutorSessions);

// Learners view all sessions
router.get("/all", sessionController.getAllSessions);

// Register learner for a session
router.post("/register", sessionController.registerLearner);

// Unregister learner from a session
router.post("/unregister", sessionController.unregisterLearner);

// Learner views their registered sessions
router.get("/learner/:learnerId", sessionController.getLearnerSessions);

// Tutor deletes a session
router.delete("/delete/:sessionId", sessionController.deleteSession);

module.exports = router;
