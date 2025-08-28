import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const CreateSession = () => {
  const [session, setSession] = useState({
    topic: "",
    session_date: "",
    session_time: "",
    form_status: "Upcoming",
  });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.lordicon.com/lordicon.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleChange = (e) => {
    setSession({ ...session, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    const rawUserId = localStorage.getItem("user_id");
    const userId = rawUserId && !isNaN(rawUserId) ? parseInt(rawUserId) : null;

    if (!userId) {
      alert("Invalid user ID. Please log in again.");
      return;
    }

    try {
      const payload = {
        ...session,
        user_id: userId,
      };
      await axios.post("http://localhost:8083/api/session/create", payload);
      alert("Session created successfully!");
      setSession({
        topic: "",
        session_date: "",
        session_time: "",
        form_status: "Upcoming",
      });
    } catch (err) {
      console.error("Error creating session:", err);
      alert(err.response?.data || "Failed to create session. Please try again.");
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row bg-gradient-to-br from-indigo-100 via-white to-blue-50 overflow-hidden">
      {/* Left - Quote Side */}
      <div className="hidden md:flex md:w-[45%] flex-col justify-center items-start px-12 text-left">
        <h1 className="text-4xl font-extrabold text-orange-500 leading-snug mb-4 font-sans">
          Design Inspiring Sessions,
          <br />
          Build Lifelong Learners
        </h1>
        <p className="text-md text-blue-700 font-serif italic">
          “A good teacher can inspire hope, ignite the imagination, and instill a love of learning.”
          <br /> — Brad Henry
        </p>
      </div>

      {/* Right - Form Side */}
      <div className="w-full md:w-[55%] flex items-center justify-center mr-15">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white border-2 border-blue-200 shadow-xl rounded-2xl px-8 py-6 w-full max-w-lg"
        >
          <div className="text-center mb-2">
            <h1 className="text-2xl font-bold text-blue-700">Tutor Panel</h1>
            <p className="text-xs text-gray-500">Create a session that matters</p>
          </div>

          <h2 className="text-lg font-semibold text-center text-black mb-4">
            Schedule New Session
          </h2>

          <form className="space-y-4" onSubmit={handleCreate}>
            <input
              type="text"
              name="topic"
              value={session.topic}
              onChange={handleChange}
              placeholder="Session topic"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              required
            />
            <input
              type="time"
              name="session_time"
              value={session.session_time}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              required
            />
            <input
              type="date"
              name="session_date"
              value={session.session_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              required
            />
            <select
              name="form_status"
              value={session.form_status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            >
              <option>Upcoming</option>
              <option>Completed</option>
            </select>

            <button
              type="submit"
              className="w-full py-2 bg-blue-700 text-white text-sm font-medium rounded hover:bg-blue-800 transition"
            >
              📅 Create Session
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateSession;
