const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  gmail: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profile: {
    type: String, // store image URL
    default: ""
  },
  age: {
    type: Number,
    required: true
  },
  role: {
    type: String,
    enum: ["learner", "tutor"],
    required: true
  }
});

module.exports = mongoose.model("User", userSchema);
