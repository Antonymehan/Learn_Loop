import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa";

const API_BASE = "http://localhost:5000/api/sessions";

const MySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("learnloopUser") || "{}");
  const learnerId = storedUser?._id || storedUser?.id;

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/learner/${learnerId}`);
        setSessions(res.data);
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
        setStatusMessage("Failed to fetch your sessions.");
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [learnerId]);

  const handleUnregister = async (sessionId) => {
    try {
      await axios.post(`${API_BASE}/unregister`, { sessionId, learnerId });
      setSessions((prev) => prev.filter((s) => s._id !== sessionId));
      setStatusMessage("Unregistered successfully!");
    } catch (err) {
      console.error("Failed to unregister:", err);
      setStatusMessage(err.response?.data?.message || "Failed to unregister.");
    }
  };

  const handleJoin = (session) => {
    // Placeholder action: replace with your actual join logic (Zoom link, video, etc.)
    alert(`Joining session: ${session.title}`);
  };

  if (loading) return <p className="text-center mt-4">Loading sessions...</p>;
  if (sessions.length === 0)
    return <p className="text-center mt-4">You are not registered for any sessions.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Sessions</h2>
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
            {session.tutor && (
              <p className="text-gray-600 text-sm mt-1">
                Tutor: {session.tutor.user?.name || "Unknown"}
              </p>
            )}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleUnregister(session._id)}
                className="flex-1 py-2 rounded-full font-semibold bg-red-500 text-white hover:bg-red-600"
              >
                Unregister
              </button>
              <button
                onClick={() => handleJoin(session)}
                className="flex-1 py-2 rounded-full font-semibold bg-green-500 text-white hover:bg-green-600"
              >
                Join
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      {statusMessage && (
        <p className="text-center text-blue-700 mt-4">{statusMessage}</p>
      )}
    </div>
  );
};

export default MySessions;
