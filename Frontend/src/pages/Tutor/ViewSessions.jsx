import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaChalkboardTeacher, FaUsers, FaTrash, FaPlay } from "react-icons/fa";

const API_BASE = "http://localhost:5000/api/sessions";

const ViewSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(""); // "tutor" or "learner"
  const [statusMessage, setStatusMessage] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("learnloopUser") || "{}");
  const userId = storedUser?._id || storedUser?.id;
  const userRole = storedUser?.role;

  useEffect(() => {
    if (!userId) return;

    const fetchSessions = async () => {
      setLoading(true);
      try {
        setRole(userRole);

        if (userRole === "tutor") {
          const tutorRes = await axios.get(`http://localhost:5000/api/tutors/${userId}`);
          const tutorId = tutorRes.data._id;

          const res = await axios.get(`${API_BASE}/tutor/${tutorId}`);
          setSessions(res.data);
        } else if (userRole === "learner") {
          const res = await axios.get(`${API_BASE}/all`);
          setSessions(res.data);
        } else {
          setStatusMessage("Invalid user role.");
        }
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
        setStatusMessage("Failed to fetch sessions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [userId, userRole]);

  const handleDelete = async (sessionId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this session?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE}/delete/${sessionId}`);
      setSessions((prev) => prev.filter((s) => s._id !== sessionId));
      setStatusMessage("Session deleted successfully.");
    } catch (err) {
      console.error("Failed to delete session:", err);
      setStatusMessage("Failed to delete session.");
    }
  };

  const handleStart = (sessionId) => {
    // For demo, just show an alert. Replace with actual logic if needed.
    alert(`Session ${sessionId} started!`);
  };

  if (loading) return <p className="text-center mt-4">Loading sessions...</p>;
  if (sessions.length === 0) return <p className="text-center mt-4">No sessions found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        {role === "tutor" ? <FaChalkboardTeacher /> : <FaUsers />}
        {role === "tutor" ? "Your Created Sessions" : "Available Sessions"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessions.map((session) => (
          <motion.div
            key={session._id}
            className="border p-4 rounded shadow hover:shadow-md transition relative"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="font-semibold text-lg mb-2">{session.title}</h3>
            <p className="text-gray-700 mb-1">{session.description}</p>
            <p className="text-gray-600 text-sm">
              Date: {new Date(session.date).toLocaleDateString()} &nbsp; Time: {session.time}
            </p>
            {role === "learner" && session.tutor && (
              <p className="text-gray-600 text-sm mt-1">
                Tutor: {session.tutor.user?.name || "Unknown"}
              </p>
            )}

            {/* Start button */}
            <button
              onClick={() => handleStart(session._id)}
              className="mt-3 w-full py-2 rounded-full font-semibold bg-green-500 text-white hover:bg-green-600 flex items-center justify-center gap-2"
            >
              <FaPlay /> Start
            </button>

            {/* Delete button for tutors */}
            {role === "tutor" && (
              <button
                onClick={() => handleDelete(session._id)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                title="Delete Session"
              >
                <FaTrash />
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {statusMessage && <p className="text-center text-red-600 mt-4">{statusMessage}</p>}
    </div>
  );
};

export default ViewSessions;
