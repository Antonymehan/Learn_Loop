import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlusCircle, FaCalendarAlt, FaComments, FaUserCircle } from "react-icons/fa";
import axios from "axios";

import TutorProfile from "./TutorProfile";
import CreateSession from "./CreateSession";
import ViewSessions from "./ViewSessions";
import ViewFeedback from "./ViewFeedback";

const tabs = [
  { id: "profile", label: "Profile", icon: <FaUserCircle /> },
  { id: "create", label: "Create Session", icon: <FaPlusCircle /> },
  { id: "view", label: "View Sessions", icon: <FaCalendarAlt /> },
  { id: "feedback", label: "View Feedback", icon: <FaComments /> },
];

const TutorDashboard = () => {
  const [tab, setTab] = useState("create");
  const storedUser = JSON.parse(localStorage.getItem("learnloopUser"));
  const userId = storedUser?.id || storedUser?._id || storedUser?.user_id;

  const [tutorName, setTutorName] = useState(storedUser?.name || "Tutor");
  const [profileExists, setProfileExists] = useState(false);
  const [tutorDetails, setTutorDetails] = useState({
    domain: "",
    workExperience: "",
    professional: "",
    age: "",
  });

  // Fetch tutor profile
  const fetchTutorProfile = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/tutors/${userId}`);
      const tutor = res.data;
      if (tutor) {
        setTutorDetails({
          domain: tutor.domain || "",
          workExperience: tutor.workExperience || "",
          professional: tutor.professional || "",
          age: tutor.age || storedUser.age || "",
        });
        setProfileExists(true);
      } else {
        setProfileExists(false);
        setTab("profile");
      }
    } catch {
      setProfileExists(false);
      setTab("profile");
    }
  };

  useEffect(() => {
    fetchTutorProfile();
  }, [userId]);

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/tutors/delete/${userId}`);
      localStorage.removeItem("learnloopUser");
      alert("Account deleted successfully!");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Failed to delete account.");
    }
  };

  const renderTab = () => {
    switch (tab) {
      case "profile":
        return (
          <TutorProfile
            onProfileUpdated={() => {
              fetchTutorProfile();
              setTab("create");
            }}
          />
        );
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
      {/* Header */}
      <div className="flex flex-col items-center justify-center mb-10 gap-2 text-center">
        <h1 className="text-6xl md:text-7xl font-extrabold text-blue-800 drop-shadow-sm flex items-center gap-3">
          Welcome Tutor, {tutorName}!
        </h1>
        <p className="text-md text-gray-700 mt-2">
          Ready to spark curiosity in every session.
        </p>
      </div>

      {/* Profile Card */}
      {profileExists && (
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 mb-10 border border-blue-200">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Your Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left text-gray-800">
            <div>
              <p className="font-semibold">Domain:</p>
              <p>{tutorDetails.domain}</p>
            </div>
            <div>
              <p className="font-semibold">Work Experience:</p>
              <p>{tutorDetails.workExperience}</p>
            </div>
            <div>
              <p className="font-semibold">Professional Title:</p>
              <p>{tutorDetails.professional}</p>
            </div>
            <div>
              <p className="font-semibold">Age:</p>
              <p>{tutorDetails.age}</p>
            </div>
          </div>

          {/* Delete Account */}
          <div className="mt-6 text-center">
            <button
              onClick={handleDeleteAccount}
              className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700"
            >
              Delete Account
            </button>
          </div>
        </div>
      )}

      {!profileExists && (
        <div className="max-w-2xl mx-auto bg-yellow-100 border border-yellow-300 rounded-lg p-4 mb-8 text-center text-yellow-800">
          <p>You haven't completed your profile yet.</p>
          <p>Please go to the <strong>Profile</strong> tab to fill it out.</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        {tabs.map(({ id, label, icon }) => (
          <motion.button
            key={id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-all duration-300 ${
              tab === id
                ? "bg-blue-600 text-white shadow-md scale-105"
                : "bg-white text-blue-700 border border-blue-300 hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-600 hover:text-white"
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          {renderTab()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TutorDashboard;
