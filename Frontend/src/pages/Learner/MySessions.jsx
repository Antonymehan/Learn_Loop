import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaCheck, FaTimes } from "react-icons/fa";

const API_BASE = "http://localhost:5000/api/sessions";

const MySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [processing, setProcessing] = useState(null); // to disable button while unregistering

  // ✅ Get logged-in learner from localStorage
  const storedUser = JSON.parse(localStorage.getItem("learnloopUser") || "{}");
  const learnerId = storedUser?._id || storedUser?.id;

  // ✅ Fetch learner's registered sessions
  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/learner/${learnerId}`);
        setSessions(res.data || []);
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
        setStatusMessage("⚠️ Failed to fetch your sessions.");
      } finally {
        setLoading(false);
      }
    };
    if (learnerId) fetchSessions();
  }, [learnerId]);

  // ✅ Unregister learner from a session
  const handleUnregister = async (sessionId) => {
    setProcessing(sessionId);
    try {
      await axios.post(`${API_BASE}/unregister`, { sessionId, learnerId });
      setSessions((prev) => prev.filter((s) => s._id !== sessionId));
      setStatusMessage("✅ Unregistered successfully!");
    } catch (err) {
      console.error("Failed to unregister:", err);
      setStatusMessage(err.response?.data?.message || "❌ Failed to unregister.");
    } finally {
      setProcessing(null);
    }
  };

  // ✅ Placeholder "join" logic (replace with real link or video call)
const handleJoin = async (session) => {
  try {
   const roomName = `learnloop-${session._id}`;
  const meetingUrl = `https://meet.jit.si/${roomName}`;

  window.open(meetingUrl, "_blank"); 
    const data = await res.json();

    if (res.ok && data.link) {
      window.open(data.link, "_blank"); // ✅ open the tutor’s generated link
    } else {
      alert(data.message || `Tutor has not started "${session.title}" yet`);
    }
  } catch (error) {
    console.error(error);
    alert("Meeting join session");
  }
};


  // ✅ UI states
  if (loading) return <p className="text-center mt-6">⏳ Loading your sessions...</p>;
  if (sessions.length === 0)
    return <p className="text-center mt-6 text-gray-600">🙁 You are not registered for any sessions.</p>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">📚 My Sessions</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sessions.map((session) => (
          <motion.div
            key={session._id}
            className="border p-5 rounded-xl shadow-sm hover:shadow-lg transition relative bg-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="font-semibold text-lg mb-2">{session.title}</h3>
            <p className="text-gray-700 mb-2">{session.description || "No description provided."}</p>

            <p className="text-gray-600 text-sm">
              <strong>Date:</strong> {new Date(session.date).toLocaleDateString()} &nbsp; 
              <strong>Time:</strong> {session.time}
            </p>

            {session.tutor && (
              <p className="text-gray-600 text-sm mt-1">
                <strong>Tutor:</strong> {session.tutor?.user?.name || "Unknown Tutor"}
              </p>
            )}

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleUnregister(session._id)}
                disabled={processing === session._id}
                className={`flex-1 py-2 rounded-full font-semibold ${
                  processing === session._id
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600 text-white"
                }`}
              >
                {processing === session._id ? "Processing..." : "Unregister"}
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

      {/* ✅ Status notification */}
      {statusMessage && (
        <motion.p
          className="text-center mt-6 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {statusMessage}
        </motion.p>
      )}
    </div>
  );
};

export default MySessions;
