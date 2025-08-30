import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaChalkboardTeacher, FaBriefcase, FaAward, FaUserClock } from "react-icons/fa";

const API_BASE = "http://localhost:5000/api/tutors";

const TutorProfile = ({ onProfileUpdated }) => {
  const [formData, setFormData] = useState({
    domain: "",
    workExperience: "",
    professional: "",
    age: "",
  });
  const [loading, setLoading] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("learnloopUser") || "null");
  const userId = storedUser?.id || storedUser?._id || storedUser?.user_id;

  // Fetch profile on mount
  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    axios
      .get(`${API_BASE}/${userId}`)
      .then((res) => {
        const tutor = res.data;
        if (tutor) {
          setProfileExists(true);
          setFormData({
            domain: tutor.domain || "",
            workExperience: tutor.workExperience || "",
            professional: tutor.professional || "",
            age: tutor.age?.toString() || storedUser.age?.toString() || "",
          });
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          setProfileExists(false);
          setFormData((prev) => ({ ...prev, age: storedUser.age?.toString() || "" }));
        } else {
          console.error("Fetch tutor error:", err);
        }
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { domain, workExperience, professional, age } = formData;

    if (!domain.trim() || !workExperience.trim() || !professional.trim() || !age.trim()) {
      setStatusMessage("⚠️ Please fill all fields.");
      return;
    }

    setLoading(true);
    setStatusMessage("");

    try {
      await axios.post(`${API_BASE}/create`, {
        user_id: userId,
        domain,
        workExperience,
        professional,
        age: Number(age),
      });

      setStatusMessage(profileExists ? "✅ Profile updated!" : "✅ Profile created!");
      setProfileExists(true);

      if (onProfileUpdated) onProfileUpdated();
    } catch (err) {
      console.error("Submit tutor error:", err);
      setStatusMessage("❌ Error saving profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-blue-300">
      <div className="flex items-center gap-3 mb-6">
        <FaChalkboardTeacher className="text-blue-600 text-3xl" />
        <h2 className="text-3xl font-bold text-blue-700">Tutor Profile</h2>
      </div>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
        <div className="relative">
          <FaBriefcase className="absolute top-3 left-3 text-blue-500" />
          <input
            type="text"
            name="domain"
            value={formData.domain}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            placeholder="Domain (e.g., Math, Science)"
          />
        </div>

        <div className="relative">
          <FaAward className="absolute top-3 left-3 text-blue-500" />
          <input
            type="text"
            name="professional"
            value={formData.professional}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            placeholder="Professional Title (e.g., Lecturer)"
          />
        </div>

        <div className="relative">
          <FaUserClock className="absolute top-3 left-3 text-blue-500" />
          <input
            type="text"
            name="workExperience"
            value={formData.workExperience}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            placeholder="Work Experience (e.g., 5 years)"
          />
        </div>

        <div className="relative">
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            placeholder="Age"
            min={18}
          />
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`col-span-1 md:col-span-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-full font-semibold mt-2 ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:from-blue-600 hover:to-blue-800"
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
                statusMessage.includes("❌") ? "text-red-600" : "text-blue-700"
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

export default TutorProfile;
