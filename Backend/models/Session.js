const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: "Tutor", required: true },
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, default: "Upcoming" }, // Upcoming, Completed, Cancelled
  learners: [{ type: mongoose.Schema.Types.ObjectId, ref: "Learner" }], // registered learners
}, { timestamps: true });

module.exports = mongoose.model("Session", sessionSchema);
