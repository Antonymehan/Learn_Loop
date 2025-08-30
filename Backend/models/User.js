const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gmail: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: { type: String },
  age: { type: Number },
  role: { type: String, required: true, enum: ["learner", "tutor"] }
}, { collection: "users" });

module.exports = mongoose.model("User", userSchema);
