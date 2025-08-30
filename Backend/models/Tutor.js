const mongoose = require("mongoose");

const tutorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  age: { type: Number },
  domain: { type: String },
  professional: { type: String },
  workExperience: { type: String }
}, { collection: "tutors" });

module.exports = mongoose.model("Tutor", tutorSchema);
