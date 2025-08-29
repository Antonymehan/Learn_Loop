const mongoose = require("mongoose");

const learnerSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    gmail: { type: String, required: true },
    Age: { type: Number },
    gender: { type: String, enum: ["Male", "Female", "Other"], default: "Other" },
    areaOfInterest: { type: String },
    goal: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Learner", learnerSchema);
