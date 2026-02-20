const express = require("express");
const { getTestBySubject, addQuestion } = require("../controllers/testController");

const router = express.Router();

// Route: /api/tests/java
router.get("/:subject", getTestBySubject);

// Route: /api/tests  (POST)
router.post("/", addQuestion);

module.exports = router;
