import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserEdit, FaBookOpen, FaBirthdayCake } from "react-icons/fa";

const API_BASE = "http://localhost:5000/api/learners";

const LearnerProfile = ({ onProfileUpdated }) => {
  const [formData, setFormData] = useState({
    age: "",
    interest: "",
  });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [profileExists, setProfileExists] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("learnloopUser") || "null");
  const userId = storedUser?.id || storedUser?._id;

  // Fetch existing profile
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
            age: learner.age || storedUser.age || "",
            interest: learner.interest || "",
          });
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          setProfileExists(false);
          setFormData({ age: storedUser.age || "", interest: "" });
        } else {
          console.error(err);
        }
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { age, interest } = formData;

    if (!age || !interest.trim()) {
      setStatusMessage("⚠️ Please fill all fields.");
      return;
    }

    setLoading(true);
    setStatusMessage("");

    try {
      if (profileExists) {
        // Update profile
        await axios.put(`${API_BASE}/${userId}`, { age: Number(age), interest });
        setStatusMessage("✅ Profile updated successfully!");
      } else {
        // Create profile
        await axios.post(`${API_BASE}/create`, { user_id: userId, age: Number(age), interest });
        setStatusMessage("✅ Profile created successfully!");
        setProfileExists(true);
      }

      if (onProfileUpdated) onProfileUpdated();
    } catch (err) {
      console.error(err);
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
          <FaBirthdayCake className="absolute top-3 left-3 text-green-500" />
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
            placeholder="Enter your age"
          />
        </div>

        <div className="relative">
          <FaBookOpen className="absolute top-3 left-3 text-green-500" />
          <input
            type="text"
            name="interest"
            value={formData.interest}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
            placeholder="Your area of interest"
          />
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
