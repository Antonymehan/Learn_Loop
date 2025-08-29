const mongoose = require("mongoose");

const tutorSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    age: { type: Number, required: true },
    domain: { type: String, required: true },
    professional: { type: String, required: true },
    workExperience: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tutor", tutorSchema);
