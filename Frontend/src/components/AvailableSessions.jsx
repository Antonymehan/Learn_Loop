import React from "react";
import {
  FaStar,
  FaVideo,
  FaGlobe,
  FaPaintBrush,
  FaCalculator,
  FaArrowLeft,
} from "react-icons/fa";

const sessions = [
  {
    title: "Data Structures & Algorithms Fundamentals",
    mentor: "Sarah Chen",
    rating: 4.9,
    level: "Beginner",
    time: "Today • 3:00 PM",
    participants: "24/30 participants",
    description:
      "Learn the basics of arrays, linked lists, and time complexity analysis.",
    buttonText: "Join Now",
    bgColor: "bg-blue-500",
    icon: <FaArrowLeft />,
    live: true,
  },
  {
    title: "Digital Art & Design Principles",
    mentor: "Alex Rodriguez",
    rating: 4.8,
    level: "Intermediate",
    time: "Tomorrow • 7:00 PM",
    participants: "18/25 participants",
    description:
      "Explore color theory, composition, and digital painting techniques.",
    buttonText: "Register",
    bgColor: "bg-green-500",
    icon: <FaPaintBrush />,
  },
  {
    title: "Calculus Made Simple",
    mentor: "Dr. Michael Thompson",
    rating: 4.9,
    level: "Beginner",
    time: "Feb 28 • 6:00 PM",
    participants: "15/20 participants",
    description:
      "Break down complex calculus concepts into easy-to-understand parts.",
    buttonText: "Register",
    bgColor: "bg-yellow-400",
    icon: <FaCalculator />,
  },
  {
    title: "Spanish Conversation Practice",
    mentor: "Maria Santos",
    rating: 4.7,
    level: "Intermediate",
    time: "Mar 2 • 5:30 PM",
    participants: "12/15 participants",
    description:
      "Practice conversational Spanish with native speaker guidance.",
    buttonText: "Register",
    bgColor: "bg-blue-400",
    icon: <FaGlobe />,
  },
  {
    title: "Spanish Conversation Practice",
    mentor: "Maria Santos",
    rating: 4.7,
    level: "Intermediate",
    time: "Mar 2 • 5:30 PM",
    participants: "12/15 participants",
    description:
      "Practice conversational Spanish with native speaker guidance.",
    buttonText: "Register",
    bgColor: "bg-blue-400",
    icon: <FaGlobe />,
  },
];

const AvailableSessions = () => {
  return (
    <div className="bg-gray-100 py-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Available Sessions
      </h2>

      <div className="max-w-screen-xl mx-auto py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sessions.map((session, index) => (
            <div
              key={index}
              className="bg-gradient-to-tr from-green-50 via-white to-green-100 border border-gray-200 hover:border-green-400 shadow-md rounded-xl p-6 flex flex-col text-center hover:shadow-xl transition duration-300"
            >
              {/* Card Header */}
              <div
                className={`w-full flex justify-between items-center px-4 py-2 rounded-t-xl text-white ${session.bgColor}`}
              >
                <div className="text-2xl">{session.icon}</div>
                {/* {session.live && (
                  <span className="text-xs bg-red-600 px-2 py-1 rounded font-semibold">
                    🔴 LIVE
                  </span>
                )} */}
              </div>

              {/* Card Content */}
              <div className="p-4 w-full">
                <h3 className="font-semibold text-gray-800 mb-2 text-lg leading-snug">
                  {session.title}
                </h3>

                <div className="flex items-center justify-between text-sm mb-1">
                  <div className="text-gray-700 flex items-center gap-1">
                    <FaStar className="text-yellow-500" />
                    {session.rating}
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs">
                    {session.level}
                  </span>
                </div>

                <p className="text-gray-600 text-sm">{session.time}</p>
                <p className="text-gray-500 text-sm mb-2">
                  {session.participants}
                </p>

                <p className="text-gray-500 text-sm mb-4">
                  {session.description}
                </p>

                <button
                  className={`w-full ${
                    session.buttonText === "Join Now"
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "border border-blue-400 text-blue-600 hover:bg-blue-50"
                  } py-2 rounded font-medium text-sm transition`}
                >
                  {session.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvailableSessions;
