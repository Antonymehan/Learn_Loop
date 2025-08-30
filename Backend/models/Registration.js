// models/Registration.js
const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
    learnerId: { type: mongoose.Schema.Types.ObjectId, ref: "Learner" },
    sessionDate: { type: String },
    sessionTime: { type: String }
}, { collection: "Registration" });

module.exports = mongoose.model("Registration", registrationSchema);
