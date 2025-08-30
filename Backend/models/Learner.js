const mongoose = require("mongoose");

const learnerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  age: { type: Number },
  interest: { type: String }
}, { collection: "learners" });

module.exports = mongoose.model("Learner", learnerSchema);
