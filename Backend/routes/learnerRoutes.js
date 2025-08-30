const express = require("express");
const router = express.Router();
const learnerController = require("../controllers/learnerController");

// Routes
router.post("/create", learnerController.createLearner);          // Create profile
router.put("/:userId", learnerController.updateLearner);          // Update profile
router.get("/:userId", learnerController.getLearnerByUserId);     // Get profile

module.exports = router;
