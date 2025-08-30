import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaUsers, FaCheck, FaHeart } from "react-icons/fa";

const API_BASE = "http://localhost:5000/api/sessions";
const LEARNER_API = "http://localhost:5000/api/learners"; // adjust if needed

const DiscoverSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [learnerInterest, setLearnerInterest] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("learnloopUser") || "{}");
  const learnerId = storedUser?._id || storedUser?.id;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [sessionsRes, learnerRes] = await Promise.all([
          axios.get(`${API_BASE}/all`),
          axios.get(`${LEARNER_API}/${learnerId}`),
        ]);

        setSessions(sessionsRes.data);
        setLearnerInterest(learnerRes.data?.interest || "");
      } catch (err) {
        console.error("Error fetching data:", err);
        setStatusMessage("Failed to fetch sessions or learner profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [learnerId]);

  const toggleRegister = async (sessionId, isRegistered) => {
    try {
      if (isRegistered) {
        // Unregister
        await axios.post(`${API_BASE}/unregister`, { sessionId, learnerId });
        setSessions((prev) =>
          prev.map((s) =>
            s._id === sessionId
              ? { ...s, learners: s.learners.filter((id) => id !== learnerId) }
              : s
          )
        );
        setStatusMessage("Unregistered successfully!");
      } else {
        // Register
        await axios.post(`${API_BASE}/register`, { sessionId, learnerId });
        setSessions((prev) =>
          prev.map((s) =>
            s._id === sessionId ? { ...s, learners: [...s.learners, learnerId] } : s
          )
        );
        setStatusMessage("Registered successfully!");
      }
    } catch (err) {
      console.error("Failed to toggle registration:", err);
      setStatusMessage(err.response?.data?.message || "Failed to update registration.");
    }
  };

  if (loading) return <p className="text-center mt-4">Loading sessions...</p>;
  if (sessions.length === 0)
    return <p className="text-center mt-4">No sessions available.</p>;

  // Filter sessions based on learner interest
  const interestedSessions = learnerInterest
    ? sessions.filter(
        (s) =>
          s.title?.toLowerCase().includes(learnerInterest.toLowerCase()) ||
          s.description?.toLowerCase().includes(learnerInterest.toLowerCase())
      )
    : [];

  const otherSessions = sessions.filter((s) => !interestedSessions.includes(s));

  const renderSessionCard = (session) => {
    const isRegistered = session.learners?.includes(learnerId);

    return (
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

        <button
          onClick={() => toggleRegister(session._id, isRegistered)}
          className={`mt-3 w-full py-2 rounded-full font-semibold transition-colors ${
            isRegistered
              ? "bg-red-500 text-white hover:bg-red-600 flex items-center justify-center gap-2"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {isRegistered ? (
            <>
              <FaCheck /> Unregister
            </>
          ) : (
            "Register"
          )}
        </button>
      </motion.div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaUsers />
        Discover Sessions
      </h2>

      {/* Interested Sessions */}
      {learnerInterest && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-pink-600">
            <FaHeart /> Your Interested Sessions ({learnerInterest})
          </h3>
          {interestedSessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {interestedSessions.map(renderSessionCard)}
            </div>
          ) : (
            <p className="text-gray-500">No sessions match your interest.</p>
          )}
        </div>
      )}

      {/* All Sessions */}
      <div>
        <h3 className="text-xl font-semibold mb-4">All Available Sessions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {otherSessions.map(renderSessionCard)}
        </div>
      </div>

      {statusMessage && (
        <p className="text-center text-blue-700 mt-4">{statusMessage}</p>
      )}
    </div>
  );
};

export default DiscoverSessions;
