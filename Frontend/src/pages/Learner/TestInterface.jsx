import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaFlask, FaSearch } from "react-icons/fa";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/tests"; // Backend API base URL

const TestInterface = () => {
  const [subject, setSubject] = useState("");
  const [selectedTest, setSelectedTest] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  // 🔍 Fetch random test questions from backend
  const handleSearch = async () => {
    const key = subject.trim().toLowerCase();
    if (!key) return alert("Please enter a subject!");

    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/${key}`);
      if (Array.isArray(res.data) && res.data.length > 0) {
        setSelectedTest(res.data);
        setAnswers({});
      } else {
        alert("No test found for this subject.");
        setSelectedTest([]);
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching test data. Please check your backend connection.");
    } finally {
      setLoading(false);
    }
  };

  // 🧠 Handle answer selection
  const handleAnswer = (qIndex, aIndex) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: aIndex }));
  };

  // 🧾 Calculate test score
  const calculateScore = () => {
    let score = 0;
    selectedTest.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) score++;
    });
    return score;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-10 text-center mt-6"
    >
      {/* 🔹 Header Section */}
      <h2 className="text-4xl font-extrabold text-emerald-700 mb-4 flex items-center justify-center gap-3">
        <FaFlask className="text-emerald-600" /> Explore Your Knowledge Hub
      </h2>
      <p className="text-gray-700 mb-8 text-lg">
        Challenge yourself with AI-powered subject-based tests designed to assess and enhance your learning skills.
      </p>

      {/* 🔍 Search Bar */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="flex items-center bg-emerald-50 border border-emerald-300 rounded-full px-4 py-2 w-2/3 shadow-inner">
          <FaSearch className="text-emerald-600" />
          <input
            type="text"
            placeholder="Enter subject (e.g., Java, Solidity, UI/UX)"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-transparent px-3 py-1 focus:outline-none text-emerald-800 font-medium"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full font-semibold shadow-md transition-all disabled:opacity-60"
        >
          {loading ? "Loading..." : "Search Test"}
        </button>
      </div>

      {/* 🧩 Test Questions */}
      {selectedTest.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-left bg-emerald-50 p-6 rounded-2xl shadow-inner"
        >
          <h3 className="text-2xl font-bold text-emerald-700 mb-6 text-center capitalize">
            {subject} Test
          </h3>

          {selectedTest.map((q, qIndex) => (
            <div key={qIndex} className="mb-6">
              <p className="font-semibold text-gray-800 mb-2">
                {qIndex + 1}. {q.question}
              </p>
              <div className="flex flex-col gap-2">
                {q.options.map((option, aIndex) => (
                  <label
                    key={aIndex}
                    className={`p-2 rounded-lg cursor-pointer border transition-all ${
                      answers[qIndex] === aIndex
                        ? "bg-emerald-600 text-white border-emerald-700"
                        : "border-gray-300 hover:bg-emerald-100"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${qIndex}`}
                      className="hidden"
                      onChange={() => handleAnswer(qIndex, aIndex)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={() =>
              alert(`Your Score: ${calculateScore()} / ${selectedTest.length}`)
            }
            className="mt-4 bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-all w-full"
          >
            Submit Test
          </button>
        </motion.div>
      ) : (
        <div className="text-gray-500 italic border-2 border-dashed border-emerald-300 rounded-2xl p-8">
          🔍 Search for a subject to begin your test.
        </div>
      )}
    </motion.div>
  );
};

export default TestInterface;
