import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserEdit, FaBookOpen, FaBirthdayCake, FaPlus, FaTimes } from "react-icons/fa";

const LearnerProfile = () => {
  const [formData, setFormData] = useState({ interest: "", age: "" });
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [profileExists, setProfileExists] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("learnloopUser")); 

  useEffect(() => {
    if (storedUser) {
      setLoading(true);
      axios
        .get(`http://localhost:8083/api/learner/${storedUser.user_id}`)
        .then((res) => {
          const learner = res.data;
          setProfileExists(true);
          setFormData({
            interest: learner.interest || "",
            age: learner.age?.toString() || "",
          });
          setSkills(learner.skills || []);
        })
        .catch((err) => {
          if (err.response && err.response.status === 404) {
            setProfileExists(false);
          } else {
            console.error("Fetch error:", err);
          }
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSkillAdd = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
      setSkillInput("");
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setSkills((prev) => prev.filter((skill) => skill !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.interest.trim() || !formData.age.trim()) {
      setStatusMessage("⚠️ Please fill all fields.");
      return;
    }

    setLoading(true);
    const url = profileExists
      ? `http://localhost:8083/api/learner/${storedUser.user_id}`
      : "http://localhost:8083/api/learner/create";

    const method = profileExists ? "put" : "post";
    const payload = {
      user_id: storedUser.user_id,
      interest: formData.interest.trim(),
      age: parseInt(formData.age),
      skills,
    };

    try {
      await axios({ method, url, data: payload });
      setStatusMessage("✅ Learner profile saved!");
      setProfileExists(true);
    } catch (err) {
      console.error("Submit error:", err);
      setStatusMessage("❌ Error saving profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-green-300"
    >
      <div className="flex items-center gap-3 mb-6">
        <FaUserEdit className="text-green-600 text-3xl" />
        <h2 className="text-3xl font-bold text-green-700">Your Learning Profile</h2>
      </div>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
        {/* Interest Field */}
        <div className="relative">
          <FaBookOpen className="absolute top-3 left-3 text-green-500" />
          <input
            type="text"
            name="interest"
            value={formData.interest}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
            placeholder="e.g., Math, Art, History"
          />
          <label className="block text-sm text-gray-600 mt-1 ml-1">Interested Area</label>
        </div>

        {/* Age Field */}
        <div className="relative">
          <FaBirthdayCake className="absolute top-3 left-3 text-green-500" />
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
            placeholder="Your age"
          />
          <label className="block text-sm text-gray-600 mt-1 ml-1">Age</label>
        </div>

        {/* Skills Input */}
        <div className="col-span-1 md:col-span-2">
          <label className="block font-semibold text-gray-700 mb-2">Skills</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSkillAdd())}
              className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Type a skill and press Enter"
            />
            <button
              type="button"
              onClick={handleSkillAdd}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <FaPlus />
            </button>
          </div>

          {/* Skill Tags */}
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full shadow-sm"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleSkillRemove(skill)}
                  className="ml-2 text-green-600 hover:text-red-500"
                >
                  <FaTimes />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`col-span-1 md:col-span-2 bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-3 rounded-full font-semibold mt-2 transition-all ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:from-green-600 hover:to-green-800"
          }`}
        >
          {loading ? "Saving..." : profileExists ? "Update Profile" : "Create Profile"}
        </motion.button>

        {/* Status Message */}
        <AnimatePresence>
          {statusMessage && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4 }}
              className="col-span-1 md:col-span-2 text-center text-sm mt-4 text-green-700"
            >
              {statusMessage}
            </motion.p>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
};

export default LearnerProfile;
