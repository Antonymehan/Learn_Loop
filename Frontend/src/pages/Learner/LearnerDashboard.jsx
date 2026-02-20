import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DiscoverSessions from "./DiscoverSessions";
import MySessions from "./MySessions";
import SubmitReview from "./SubmitReview";
import LearnerProfile from "./LearnerProfile";
import CodeCompiler from "./CodeCompiler";
import TestInterface from "./TestInterface"; // ✅ New import

import {
  FaCompass,
  FaUserGraduate,
  FaStar,
  FaUserCircle,
  FaTrash,
  FaSearch,
  FaChalkboardTeacher,
  FaSignOutAlt,
  FaCode,
  FaFlask, // ✅ Icon for Test Interface
} from "react-icons/fa";

import axios from "axios";

const API_BASE = "http://localhost:5000/api/learners";

const tabs = [
  { id: "discover", label: "Discover Classes", icon: <FaCompass /> },
  { id: "my", label: "My Sessions", icon: <FaUserGraduate /> },
  { id: "review", label: "Submit Review", icon: <FaStar /> },
  { id: "profile", label: "Profile", icon: <FaUserCircle /> },
  { id: "codeCompiler", label: "Code Compiler", icon: <FaCode /> },
  { id: "testInterface", label: "Test Interface", icon: <FaFlask /> }, // ✅ New tab
];

const LearnerDashboard = () => {
  const [tab, setTab] = useState("discover");
  const [userName, setUserName] = useState("Learner");
  const [learnerDetails, setLearnerDetails] = useState({
    age: "",
    interest: "",
  });
  const [profileExists, setProfileExists] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("learnloopUser") || "{}");
  const userId = storedUser.id || storedUser._id;

  const fetchLearnerProfile = () => {
    if (!userId) {
      setProfileExists(false);
      setTab("profile");
      return;
    }

    setUserName(storedUser.name || "Learner");

    axios
      .get(`${API_BASE}/${userId}`)
      .then((res) => {
        const learner = res.data;
        if (learner && (learner.age || learner.interest)) {
          setLearnerDetails({
            age: learner.age || storedUser.age || "",
            interest: learner.interest || "",
          });
          setProfileExists(true);
        } else {
          setProfileExists(false);
          setTab("profile");
        }
      })
      .catch(() => {
        setProfileExists(false);
        setTab("profile");
      });
  };

  useEffect(() => {
    const savedTab = localStorage.getItem("learnerDashboardTab");
    if (savedTab) setTab(savedTab);
    fetchLearnerProfile();
  }, []);

  useEffect(() => {
    localStorage.setItem("learnerDashboardTab", tab);
  }, [tab]);

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE}/delete/${userId}`);
      localStorage.removeItem("learnloopUser");
      alert("Account deleted successfully!");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Failed to delete account.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("learnloopUser");
    window.location.href = "/";
  };

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
      case "codeCompiler":
        return <CodeCompiler />;
      case "testInterface": // ✅ new case
        return <TestInterface />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 font-serif overflow-hidden">
      {/* Top Navbar */}
      <header className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          {/* Logo */}
          <h1
            className="text-3xl font-extrabold text-emerald-800 cursor-pointer tracking-wide"
            onClick={() => setTab("discover")}
          >
            LearnLoop
          </h1>

          {/* Search Bar */}
          <div className="flex items-center w-1/2 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 shadow-inner">
            <FaSearch className="text-emerald-600" />
            <input
              type="text"
              placeholder="Search for classes, topics..."
              className="w-full bg-transparent px-2 py-1 focus:outline-none font-medium text-emerald-800"
            />
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-700 text-white hover:bg-emerald-800 transition shadow-md"
            >
              <FaUserCircle size={20} />
              <span className="font-semibold">{userName}</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-xl z-50">
                <button
                  onClick={() => {
                    setTab("my");
                    setDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-emerald-50"
                >
                  <FaChalkboardTeacher /> My Classes
                </button>
                <button
                  onClick={() => {
                    setTab("review");
                    setDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-emerald-50"
                >
                  <FaStar /> Feedback
                </button>
                <button
                  onClick={() => {
                    setTab("profile");
                    setDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-emerald-50"
                >
                  <FaUserGraduate /> My Profile
                </button>
                <button
                  onClick={() => {
                    setTab("codeCompiler");
                    setDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-emerald-50"
                >
                  <FaCode /> Code Compiler
                </button>

                {/* ✅ New Test Interface Option */}
                <button
                  onClick={() => {
                    setTab("testInterface");
                    setDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-emerald-50"
                >
                  <FaFlask /> Test Interface
                </button>

                <hr />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
                >
                  <FaSignOutAlt /> Logout
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex items-center gap-2 w-full px-4 py-2 text-left text-red-700 hover:bg-red-100"
                >
                  <FaTrash /> Delete Account
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="pt-24 px-6 pb-10 max-w-7xl mx-auto">
        {/* Learner Profile Highlight Card */}
        <AnimatePresence>
          {profileExists && tab === "profile" ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5 }}
              className="relative max-w-4xl mx-auto mb-10"
            >
              <div className="bg-white shadow-2xl rounded-lg flex border border-emerald-200 overflow-hidden relative">
                <div className="w-1/2 p-6 bg-emerald-50 relative">
                  <h2 className="text-2xl font-bold text-emerald-800 mb-4">
                    📖 Your Profile
                  </h2>
                  <p className="font-semibold text-emerald-700">Age:</p>
                  <p className="mb-4">{learnerDetails.age}</p>
                </div>
                <div className="w-1 bg-emerald-200 shadow-inner"></div>
                <div className="w-1/2 p-6 bg-white relative">
                  <p className="font-semibold text-emerald-700">Area of Interest:</p>
                  <p>{learnerDetails.interest}</p>
                </div>
              </div>
            </motion.div>
          ) : tab === "profile" && !profileExists ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto bg-yellow-100 border border-yellow-300 rounded-lg p-4 mb-8 text-center text-yellow-800"
            >
              <p>You haven't completed your profile yet.</p>
              <p>
                Please go to the <strong>Profile</strong> tab to fill it out.
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Tabs Section */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {tabs
            .filter(
              (t) => t.id !== "codeCompiler" && t.id !== "testInterface"
            ) // hide both from main buttons
            .map(({ id, label, icon }) => (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  tab === id
                    ? "bg-emerald-700 text-white shadow-md scale-105"
                    : "text-emerald-700 border border-emerald-300 hover:bg-gradient-to-r hover:from-emerald-400 hover:to-emerald-600 hover:text-white"
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
      </main>
    </div>
  );
};

export default LearnerDashboard;
