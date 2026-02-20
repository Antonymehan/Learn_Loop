const TestQuestion = require("../models/TestQuestion");

// ✅ Fetch random 15 questions for a given subject
const getTestBySubject = async (req, res) => {
  try {
    const { subject } = req.params;

    const questions = await TestQuestion.aggregate([
      { $match: { subject: subject.toLowerCase() } },
      { $sample: { size: 15 } }, // random 15 questions
    ]);

    if (questions.length === 0) {
      return res.status(404).json({ message: "No test found for this subject" });
    }

    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Add new question (for admin/testing)
const addQuestion = async (req, res) => {
  try {
    const { subject, question, options, correctAnswer } = req.body;

    const newQuestion = new TestQuestion({
      subject,
      question,
      options,
      correctAnswer,
    });

    await newQuestion.save();
    res.status(201).json({ message: "Question added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTestBySubject, addQuestion };
