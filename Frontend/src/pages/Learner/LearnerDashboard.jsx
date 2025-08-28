import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DiscoverSessions from "./DiscoverSessions";
import MySessions from "./MySessions";
import SubmitReview from "./SubmitReview";
import LearnerProfile from "./LearnerProfile";
import { FaCompass, FaUserGraduate, FaStar, FaUserCircle } from "react-icons/fa";
import axios from "axios";

const tabs = [
  { id: "profile", label: "Profile", icon: <FaUserCircle /> },
  { id: "discover", label: "Discover Classes", icon: <FaCompass /> },
  { id: "my", label: "My Sessions", icon: <FaUserGraduate /> },
  { id: "review", label: "Submit Review", icon: <FaStar /> },
];

const LearnerDashboard = () => {
  const [tab, setTab] = useState("discover");
  const [userName, setUserName] = useState("Learner");
  const [learnerDetails, setLearnerDetails] = useState({ interest: "", age: "" });
  const [profileExists, setProfileExists] = useState(false);

  const fetchLearnerProfile = () => {
    const storedUser = JSON.parse(localStorage.getItem("learnloopUser"));
    if (storedUser) {
      setUserName(storedUser.name || "Learner");

      axios
        .get(`http://localhost:8083/api/learner/${storedUser.user_id}`)
        .then((res) => {
          const learner = res.data;
          if (learner && learner.interest) {
            setLearnerDetails({ interest: learner.interest, age: learner.age });
            setProfileExists(true);
          } else {
            setProfileExists(false);
            setTab("profile");
          }
        })
        .catch(() => {
          console.warn("No learner profile found.");
          setProfileExists(false);
          setTab("profile");
        });
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.lordicon.com/lordicon.js";
    script.async = true;
    document.body.appendChild(script);

    const savedTab = localStorage.getItem("learnerDashboardTab");
    if (savedTab) setTab(savedTab);

    fetchLearnerProfile();
  }, []);

  useEffect(() => {
    localStorage.setItem("learnerDashboardTab", tab);
  }, [tab]);

  const renderTab = () => {
    switch (tab) {
      case "profile":
        return <LearnerProfile onProfileUpdated={fetchLearnerProfile} />;
      case "discover":
        return <DiscoverSessions />;
      case "my":
        return <MySessions />;
      case "review":
        return <SubmitReview />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-green-100 via-white to-green-50 p-6 font-sans overflow-hidden">
      {/* Header */}
      <div className="flex flex-col items-center justify-center mb-10 text-center">
        <h1 className="text-6xl md:text-7xl font-extrabold text-green-800 drop-shadow-sm flex items-center gap-3">
          Welcome Learner, {userName}!
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <lord-icon
              src="https://cdn.lordicon.com/zubhquzc.json"
              trigger="hover"
              style={{ width: "60px", height: "60px" }}
            ></lord-icon>
          </motion.div>
        </h1>
        <p className="text-md text-gray-600 mt-2">Let’s make today a learning adventure.</p>
      </div>

      {/* Learner Profile Card */}
      <AnimatePresence>
        {profileExists ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 mb-10 border border-green-200"
          >
            <h2 className="text-2xl font-bold text-green-700 mb-4">Your Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800">
              <div>
                <p className="font-semibold">Interested Area:</p>
                <p>{learnerDetails.interest}</p>
              </div>
              <div>
                <p className="font-semibold">Age:</p>
                <p>{learnerDetails.age}</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto bg-yellow-100 border border-yellow-300 rounded-lg p-4 mb-8 text-center text-yellow-800"
          >
            <p>You haven't completed your profile yet.</p>
            <p>Please go to the <strong>Profile</strong> tab to fill it out.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        {tabs.map(({ id, label, icon }) => (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-all duration-300 ${
              tab === id
                ? "bg-green-600 text-white shadow-md scale-105"
                : "text-green-700 border border-green-300 hover:bg-gradient-to-r hover:from-green-400 hover:to-green-600 hover:text-white"
            }`}
          >
            <span className="text-lg">{icon}</span>
            <span>{label}</span>
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          layout
        >
          {renderTab()}
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mt-16 text-center"
      >
        <lord-icon
          src="https://cdn.lordicon.com/zpxybbhl.json"
          trigger="loop"
          style={{ width: "64px", height: "64px", margin: "auto" }}
        ></lord-icon>
        <h2 className="text-3xl font-bold text-green-700 mt-4">
          "Learning is the loop that never ends."
        </h2>
        <p className="text-sm text-gray-500 mt-2">Stay curious, stay connected 🌱</p>
      </motion.div>
    </div>
  );
};

export default LearnerDashboard;
