import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import {
  FaPlusCircle,
  FaCalendarAlt,
  FaComments,
  FaUserCircle,
} from "react-icons/fa";

import CreateSession from "./CreateSession";
import ViewSessions from "./ViewSessions";
import ViewFeedback from "./ViewFeedback";
import TutorProfile from "./TutorProfile";
import axios from "axios";

const tabs = [
  { id: "profile", label: "Profile", icon: <FaUserCircle /> },
  { id: "create", label: "Create Session", icon: <FaPlusCircle /> },
  { id: "view", label: "View Sessions", icon: <FaCalendarAlt /> },
  { id: "feedback", label: "View Feedback", icon: <FaComments /> },
];

const TutorDashboard = () => {
  const [tab, setTab] = useState("create");
  const location = useLocation();
  const username = location.state?.username || localStorage.getItem("username"); // ✅ Always available
  const userId = localStorage.getItem("user_id"); // ✅ used for fetching tutor details

  const [tutorName, setTutorName] = useState(username || "Tutor");
  const [tutorDetails, setTutorDetails] = useState({
    domain: "",
    workexperience: "",
    professional: "",
  });
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.lordicon.com/lordicon.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:8083/api/tutor/${userId}`)
        .then((res) => {
          const tutor = res.data;
          if (tutor && tutor.domain) {
            setTutorName(username || "Tutor");
            setTutorDetails({
              domain: tutor.domain,
              workexperience: tutor.workexperience,
              professional: tutor.professional,
            });
            setProfileExists(true);
          } else {
            setProfileExists(false);
            setTab("profile");
          }
        })
        .catch((err) => {
          console.warn(
            "No existing profile found, please complete your profile."
          );
          setProfileExists(false);
          setTab("profile");
        });
    }
  }, [userId, username]);

  const renderTab = () => {
    switch (tab) {
      case "profile":
        return <TutorProfile />;
      case "create":
        return <CreateSession />;
      case "view":
        return <ViewSessions />;
      case "feedback":
        return <ViewFeedback />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-sky-200 via-white to-indigo-100 p-6 font-sans overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col items-center justify-center mb-10 gap-2 text-center">
        <div className="flex items-center justify-center gap-4">
          <h1 className="text-6xl md:text-7xl font-extrabold text-blue-800 drop-shadow-sm flex items-center gap-3">
            Welcome Tutor, {tutorName}!
            <lord-icon
              src="https://cdn.lordicon.com/dqxvvqzi.json"
              trigger="hover"
              style={{ width: "60px", height: "60px" }}
            ></lord-icon>
          </h1>
        </div>
        <p className="text-md text-gray-700 mt-2">
          Ready to spark curiosity in every session.
        </p>
      </div>

      {/* Tutor Profile Card */}
      {profileExists ? (
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 mb-10 border border-blue-200">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Your Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left text-gray-800">
            <div>
              <p className="font-semibold">Domain:</p>
              <p>{tutorDetails.domain}</p>
            </div>
            <div>
              <p className="font-semibold">Work Experience:</p>
              <p>{tutorDetails.workexperience}</p>
            </div>
            <div>
              <p className="font-semibold">Professional Title:</p>
              <p>{tutorDetails.professional}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto bg-yellow-100 border border-yellow-300 rounded-lg p-4 mb-8 text-center text-yellow-800">
          <p>You haven't completed your profile yet.</p>
          <p>
            Please fill it out in the <strong>Profile</strong> tab to get
            started.
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        {tabs.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-all duration-300
              ${
                tab === id
                  ? "bg-blue-600 text-white shadow-md scale-105"
                  : "bg-white text-blue-700 border border-blue-300 hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-600 hover:text-white"
              }`}
          >
            <span className="text-lg">{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          {renderTab()}
        </motion.div>
      </AnimatePresence>

      {/* Footer Motivation */}
      <div className="mt-16 text-center">
        <lord-icon
          src="https://cdn.lordicon.com/wmlleaaf.json"
          trigger="loop"
          style={{ width: "64px", height: "64px", margin: "auto" }}
        ></lord-icon>
        <h2 className="text-3xl font-bold text-blue-700 mt-4">
          “Teaching ignites the loop of inspiration.”
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Keep sharing, keep shaping minds 🌟
        </p>
      </div>
    </div>
  );
};

export default TutorDashboard;
