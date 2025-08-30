const express = require("express");
const router = express.Router();
const registrationController = require("../controllers/registrationController");

router.post("/register", registrationController.registerSession);
router.delete("/unregister", registrationController.unregisterSession);

module.exports = router;
