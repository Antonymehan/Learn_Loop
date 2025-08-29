import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserEdit, FaBookOpen, FaBullseye, FaVenusMars, FaBirthdayCake } from "react-icons/fa";

const API_BASE = "http://localhost:5000/api/learners";

const LearnerProfile = ({ onProfileUpdated }) => {
  const [formData, setFormData] = useState({
    areaOfInterest: "",
    gender: "",
    goal: "",
    Age: "",
  });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [profileExists, setProfileExists] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("learnloopUser") || "null");
  const userId = storedUser?.id || storedUser?._id;

  // Fetch profile
  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    axios
      .get(`${API_BASE}/${userId}`)
      .then((res) => {
        const learner = res.data;
        if (learner) {
          setProfileExists(true);
          setFormData({
            areaOfInterest: learner.areaOfInterest || "",
            gender: learner.gender || "",
            goal: learner.goal || "",
            Age: learner.Age?.toString() || storedUser.age?.toString() || "",
          });
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          setProfileExists(false);
          setFormData((prev) => ({ ...prev, Age: storedUser.age?.toString() || "" }));
        } else {
          console.error("Fetch error:", err);
        }
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { areaOfInterest, gender, goal } = formData;

    if (!areaOfInterest.trim() || !gender.trim() || !goal.trim()) {
      setStatusMessage("⚠️ Please fill all fields.");
      return;
    }

    setLoading(true);
    setStatusMessage("");

    try {
      if (profileExists) {
        await axios.post(API_BASE, { user_id: userId, areaOfInterest, gender, goal });
        setStatusMessage("✅ Profile updated successfully!");
      } else {
        await axios.post(API_BASE, { user_id: userId, areaOfInterest, gender, goal });
        setStatusMessage("✅ Profile created successfully!");
        setProfileExists(true);
      }
      if (onProfileUpdated) onProfileUpdated();
    } catch (err) {
      console.error("Submit error:", err);
      setStatusMessage("❌ Error saving profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-green-300">
      <div className="flex items-center gap-3 mb-6">
        <FaUserEdit className="text-green-600 text-3xl" />
        <h2 className="text-3xl font-bold text-green-700">Your Learning Profile</h2>
      </div>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
        <div className="relative">
          <FaBookOpen className="absolute top-3 left-3 text-green-500" />
          <input
            type="text"
            name="areaOfInterest"
            value={formData.areaOfInterest}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
            placeholder="e.g., Math, Art, History"
          />
          <label className="block text-sm text-gray-600 mt-1 ml-1">Area of Interest</label>
        </div>

        <div className="relative">
          <FaBirthdayCake className="absolute top-3 left-3 text-green-500" />
          <input
            type="number"
            name="Age"
            value={formData.Age}
            disabled
            className="w-full pl-10 pr-4 py-3 border border-gray-300 bg-gray-100 rounded-lg"
          />
          <label className="block text-sm text-gray-600 mt-1 ml-1">Age</label>
        </div>

        <div className="relative">
          <FaVenusMars className="absolute top-3 left-3 text-green-500" />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <label className="block text-sm text-gray-600 mt-1 ml-1">Gender</label>
        </div>

        <div className="relative">
          <FaBullseye className="absolute top-3 left-3 text-green-500" />
          <input
            type="text"
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
            placeholder="Your learning goal"
          />
          <label className="block text-sm text-gray-600 mt-1 ml-1">Goal</label>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`col-span-1 md:col-span-2 bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-3 rounded-full font-semibold mt-2 ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:from-green-600 hover:to-green-800"
          }`}
        >
          {loading ? "Saving..." : profileExists ? "Update Profile" : "Create Profile"}
        </motion.button>

        <AnimatePresence>
          {statusMessage && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4 }}
              className={`col-span-1 md:col-span-2 text-center text-sm mt-4 ${
                statusMessage.includes("❌") ? "text-red-600" : "text-green-700"
              }`}
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
