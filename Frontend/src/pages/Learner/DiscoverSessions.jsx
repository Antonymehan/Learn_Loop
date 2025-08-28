import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { MdTopic, MdDateRange, MdAccessTime, MdPerson, MdStar, MdList } from "react-icons/md";

const DiscoverSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [registeredSessionIds, setRegisteredSessionIds] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [learnerInterest, setLearnerInterest] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("learnloopUser"));
  const learnerId = storedUser?.user_id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allSessionsRes, mySessionsRes, learnerRes] = await Promise.all([
          axios.get("http://localhost:8083/api/session/discover"),
          axios.get(`http://localhost:8083/api/learner/${learnerId}/mysessions`),
          axios.get(`http://localhost:8083/api/learner/${learnerId}`),
        ]);

        setSessions(allSessionsRes.data);
        setRegisteredSessionIds(mySessionsRes.data.map((s) => s.sessionId));
        setLearnerInterest(learnerRes.data.interest?.toLowerCase() || "");
      } catch (err) {
        console.error("Failed to fetch data:", err);
        alert("Unable to load sessions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (learnerId) {
      fetchData();
    }
  }, [learnerId]);

  const register = async (session) => {
    const trimmedTime = session.sessionTime.split(".")[0];

    const payload = {
      learnerId,
      sessionId: session.sessionId,
      sessionDate: session.sessionDate,
      sessionTime: trimmedTime,
    };

    try {
      await axios.post("http://localhost:8083/api/learner/registerSession", payload);
      alert("✅ Registered successfully!");
      setRegisteredSessionIds((prev) => [...prev, session.sessionId]);
    } catch (err) {
      console.error("Registration failed:", err);
      alert(err.response?.data || "❌ Could not register. Please try again.");
    }
  };

  const unregister = async (session) => {
    const trimmedTime = session.sessionTime.split(".")[0];

    const payload = {
      learnerId,
      sessionId: session.sessionId,
      sessionDate: session.sessionDate,
      sessionTime: trimmedTime,
    };

    try {
      await axios.delete("http://localhost:8083/api/registration/unregister", {
        data: payload,
      });
      alert("❌ Unregistered successfully.");
      setRegisteredSessionIds((prev) =>
        prev.filter((id) => id !== session.sessionId)
      );
    } catch (err) {
      console.error("Unregistration failed:", err);
      alert(err.response?.data || "❌ Could not unregister. Please try again.");
    }
  };

  const filteredSessions = sessions.filter((session) =>
    session.topic.toLowerCase().includes(query.toLowerCase()) ||
    (session.tutor?.user?.name || "").toLowerCase().includes(query.toLowerCase())
  );

  const interestSessions = filteredSessions.filter((session) =>
    learnerInterest && session.topic.toLowerCase().includes(learnerInterest)
  );

  const otherSessions = filteredSessions.filter(
    (session) => !interestSessions.includes(session)
  );

  const renderSessionCard = (s) => {
    const isRegistered = registeredSessionIds.includes(s.sessionId);
    const trimmedTime = s.sessionTime.split(".")[0];

    return (
      <div
        key={s.sessionId}
        className="bg-gradient-to-br from-gray-50 via-white to-gray-100 border border-slate-300 rounded-xl shadow-md hover:shadow-xl transition duration-300"
      >
        <div className="p-6 space-y-4 text-sm">
          <div className="flex items-center justify-between border-b border-gray-500 pb-2">
            <div className="flex items-center gap-2 text-slate-700 font-semibold">
              <MdTopic className="text-xl" />
              <span>Topic</span>
            </div>
            <span className="text-slate-600">{s.topic}</span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-500 pb-2">
            <div className="flex items-center gap-2 text-slate-700 font-semibold">
              <MdDateRange className="text-xl" />
              <span>Date</span>
            </div>
            <span className="text-slate-600">{s.sessionDate}</span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-500 pb-2">
            <div className="flex items-center gap-2 text-slate-700 font-semibold">
              <MdAccessTime className="text-xl" />
              <span>Time</span>
            </div>
            <span className="text-slate-600">{trimmedTime}</span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-500 pb-2">
            <div className="flex items-center gap-2 text-slate-700 font-semibold">
              <MdPerson className="text-xl" />
              <span>Tutor</span>
            </div>
            <span className="text-slate-600">{s.tutor?.user?.name || "Unknown Tutor"}</span>
          </div>

          <div className="pt-4">
            {isRegistered ? (
              <button
                onClick={() => unregister(s)}
                className="w-full bg-red-500 text-white py-2 rounded-md font-semibold hover:bg-red-600 transition duration-200"
              >
                Unregister
              </button>
            ) : (
              <button
                onClick={() => register(s)}
                className="w-full bg-green-500 text-white py-2 rounded-md font-semibold hover:bg-green-600 transition duration-200"
              >
                Register
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="font-sans text-gray-800 px-8 md:px-20 py-12">
      {/* 🔍 Search Bar */}
      <div className="flex items-center gap-2 rounded-full px-4 py-2 border border-slate-300 shadow-sm max-w-md mx-auto mb-10 transition-all duration-300 focus-within:border-green-400">
        <FaSearch className="text-slate-400" />
        <input
          type="text"
          placeholder="Search sessions..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow outline-none text-base text-gray-700 bg-transparent"
        />
      </div>

      {/* 🌟 Interested Area Section */}
      {learnerInterest && interestSessions.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-4">
            <MdStar className="text-yellow-500 text-2xl" />
            <h2 className="text-2xl font-bold text-slate-800">
              Sessions Matching Your Interest: <span className="capitalize">{learnerInterest}</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {interestSessions.map(renderSessionCard)}
          </div>
        </div>
      )}

      {/* 📚 All Other Sessions */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <MdList className="text-blue-500 text-2xl" />
          <h2 className="text-2xl font-bold text-slate-800">All Other Available Sessions</h2>
        </div>
        {loading ? (
          <div className="text-center text-slate-500 mt-10 text-lg">Loading sessions...</div>
        ) : otherSessions.length === 0 ? (
          <div className="text-center text-slate-500 mt-10 text-lg">No sessions found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherSessions.map(renderSessionCard)}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverSessions;
