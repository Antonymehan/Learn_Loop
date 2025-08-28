import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCalendarAlt,
  FaClock,
  FaClipboardList,
  FaPlay,
  FaTrashAlt,
  FaTimes,
} from "react-icons/fa";

const ViewSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [activeRoom, setActiveRoom] = useState("");
  const userId = localStorage.getItem("user_id");

  const fetchSessions = async () => {
    try {
      const res = await axios.get(`http://localhost:8083/api/session/tutor/${userId}`);
      setSessions(res.data);
    } catch (err) {
      console.error("Error fetching sessions:", err);
      alert("Failed to load sessions.");
    }
  };

  const handleDelete = async (sessionId) => {
    if (!window.confirm("Are you sure you want to delete this session?")) return;
    try {
      await axios.delete(`http://localhost:8083/api/session/${sessionId}`);
      setSessions(sessions.filter((s) => s.sessionId !== sessionId));
    } catch (err) {
      
      console.error("Error deleting session:", err);
      alert("Failed to delete session.");
    }
  };

  const handleStartClass = (sessionId) => {
    const roomName = `tutor-session-${sessionId}`;
    setActiveRoom(roomName);
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
        📋 Your Scheduled Sessions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((s) => (
          <div
            key={s.sessionId}
            className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-sm hover:shadow-md transition relative"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FaClipboardList className="text-blue-500" />
              {s.topic}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
              <FaCalendarAlt className="text-indigo-500" />
              <span>{s.sessionDate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700 mb-4">
              <FaClock className="text-indigo-500" />
              <span>{s.sessionTime}</span>
            </div>

            {/* 🎬 Start Class Button */}
            <button
              onClick={() => handleStartClass(s.sessionId)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full shadow text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
              title="Start Class"
            >
              <FaPlay />
              Start Class
            </button>

            {/* 🗑️ Delete Button */}
            <button
              onClick={() => handleDelete(s.sessionId)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              title="Delete Session"
            >
              <FaTrashAlt />
            </button>
          </div>
        ))}
      </div>

      {/* 📺 Jitsi Modal */}
      {activeRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg overflow-hidden w-[90%] h-[80%] shadow-lg relative">
            <iframe
              src={`https://meet.jit.si/${activeRoom}`}
              allow="camera; microphone; fullscreen; display-capture"
              style={{ width: "100%", height: "100%", border: "none" }}
              title="Video Class"
            />
            <button
              onClick={() => setActiveRoom("")}
              className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full flex items-center gap-1"
            >
              <FaTimes />
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewSessions;
