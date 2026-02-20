import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion } from "framer-motion";
import backgroundVideo from "../Auth/Images/pree.mp4";

// React Icons
import {
  FaChalkboardTeacher,
  FaRegCalendarAlt,
  FaClock,
  FaAlignLeft,
} from "react-icons/fa";

const API_BASE = "http://localhost:5000/api/sessions";
const TUTOR_BASE = "http://localhost:5000/api/tutors";

const CreateSession = () => {
  const [tutorId, setTutorId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(null);
  const [hour, setHour] = useState("09");
  const [minute, setMinute] = useState("00");
  const [ampm, setAmpm] = useState("AM");
  const [statusMessage, setStatusMessage] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("learnloopUser") || "null");
  const userId = storedUser?._id || storedUser?.id;

  useEffect(() => {
    const fetchTutorId = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(`${TUTOR_BASE}/${userId}`);
        setTutorId(res.data._id);
      } catch (err) {
        console.error("Failed to fetch tutor:", err);
        setStatusMessage("❌ Cannot find tutor profile. Please create it first.");
      }
    };
    fetchTutorId();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !date) {
      setStatusMessage("⚠️ Please fill all fields.");
      return;
    }

    if (!tutorId) {
      setStatusMessage("❌ Tutor ID not found. Cannot create session.");
      return;
    }

    const sessionTime = `${hour}:${minute} ${ampm}`;
    const formattedDate = date.toISOString().split("T")[0];

    try {
      await axios.post(`${API_BASE}/create`, {
        tutor_id: tutorId,
        title,
        description,
        date: formattedDate,
        time: sessionTime,
      });
      setStatusMessage("✅ Session created successfully!");
      setTitle("");
      setDescription("");
      setDate(null);
      setHour("09");
      setMinute("00");
      setAmpm("AM");
    } catch (err) {
      console.error("Create session error:", err.response?.data || err);
      setStatusMessage("❌ Failed to create session.");
    }
  };

  const hours = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0")
  );

  return (
    <div className="flex h-screen w-screen">
      {/* Left: Full Video Section */}
      <motion.div
        className="w-1/2 h-screen overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <video
          src={backgroundVideo}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Middle: Black Divider Line */}
      <div className="w-px bg-black"></div>

      {/* Right: Form Section */}
      <div className="w-1/2 h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
          className="w-full max-w-lg border border-gray-300 rounded-2xl shadow-xl p-8 bg-white max-h-[90vh] overflow-y-auto"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Create a Learning Session
          </h2>

          {statusMessage && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`mb-4 text-center font-medium ${
                statusMessage.includes("✅")
                  ? "text-green-600"
                  : statusMessage.includes("⚠️")
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {statusMessage}
            </motion.p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
                <FaChalkboardTeacher />
                Session Title
              </label>
              <input
                type="text"
                placeholder="Enter session title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
                <FaAlignLeft />
                Description
              </label>
              <textarea
                placeholder="Enter session description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
                <FaRegCalendarAlt />
                Date
              </label>
              <DatePicker
                selected={date}
                onChange={(dateObj) => setDate(dateObj)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                placeholderText="Select session date"
                dateFormat="yyyy-MM-dd"
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
                <FaClock />
                Time
              </label>
              <div className="flex gap-2">
                <select
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                  className="px-2 py-2 rounded-lg border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                >
                  {hours.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
                <span className="flex items-center">:</span>
                <select
                  value={minute}
                  onChange={(e) => setMinute(e.target.value)}
                  className="px-2 py-2 rounded-lg border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                >
                  {minutes.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <select
                  value={ampm}
                  onChange={(e) => setAmpm(e.target.value)}
                  className="px-2 py-2 rounded-lg border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                >
                  <option>AM</option>
                  <option>PM</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition"
            >
              Create Session
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateSession;
