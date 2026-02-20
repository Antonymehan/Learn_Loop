const mongoose = require("mongoose");

const testQuestionSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    lowercase: true,
  },
  question: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
  correctAnswer: {
    type: Number, // index of the correct option
    required: true,
  },
});

module.exports = mongoose.model("TestQuestion", testQuestionSchema);
