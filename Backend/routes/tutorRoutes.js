const express = require("express");
const router = express.Router();
const tutorController = require("../controllers/tutorController");

// Create or Update Tutor Profile
router.post("/create", tutorController.createOrUpdateTutor);

// Get Tutor Profile
router.get("/:id", tutorController.getTutorByUserId);

// Delete Tutor Account
router.delete("/delete/:id", tutorController.deleteTutor);

module.exports = router;
