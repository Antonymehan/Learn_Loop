import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCalendarAlt,
  FaClock,
  FaRegSadTear,
} from "react-icons/fa";
import { MdTopic } from "react-icons/md";

const MySessions = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("learnloopUser"));
    const learnerId = storedUser?.user_id;

    if (!learnerId) {
      console.warn("Learner ID not found in localStorage.");
      return;
    }

    axios
      .get(`http://localhost:8083/api/learner/${learnerId}/mysessions`)
      .then((res) => {
        const data = res.data.map((s) => ({
          id: s.sessionId,
          topic: s.topic || `Session #${s.sessionId}`,
          date: s.sessionDate,
          time: s.sessionTime.split(".")[0],
        }));
        setSessions(data);
      })
      .catch((err) => {
        console.error("Failed to load sessions:", err);
        alert("Unable to load your sessions.");
      });
  }, []);

  const handleJoin = (session) => {
    const roomName = `tutor-session-${session.id}`;
    window.open(`https://meet.jit.si/${roomName}`, "_blank");
  };

  return (
    <div className="px-8 md:px-20 py-12 font-sans text-gray-800">
      <h2 className="text-4xl font-bold mb-8 text-center text-slate-900">
        My Registered Sessions
      </h2>

      {sessions.length === 0 ? (
        <div className="text-center text-slate-500 mt-20 text-lg flex flex-col items-center gap-2">
          <FaRegSadTear className="text-3xl text-slate-400" />
          <p>You haven’t registered for any sessions yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sessions.map((s) => (
            <div
              key={s.id}
              className="bg-gradient-to-br from-gray-50 via-white to-gray-100 border border-slate-300 rounded-xl shadow-md hover:shadow-xl transition duration-300"
            >
              <div className="p-6 space-y-4 text-sm text-slate-800">
                <div className="flex items-center justify-between border-b border-gray-400 pb-2">
                  <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <MdTopic className="text-xl" />
                    <span>Topic</span>
                  </div>
                  <span className="font-medium text-slate-900">{s.topic}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-400 pb-2">
                  <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <FaCalendarAlt className="text-xl" />
                    <span>Date</span>
                  </div>
                  <span className="font-medium text-slate-900">{s.date}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-400 pb-2">
                  <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <FaClock className="text-xl" />
                    <span>Time</span>
                  </div>
                  <span className="font-medium text-slate-900">{s.time}</span>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => handleJoin(s)}
                    className="w-full bg-green-500 text-white py-2 rounded-md font-semibold hover:bg-green-600 transition duration-200"
                  >
                    Join Class
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySessions;
