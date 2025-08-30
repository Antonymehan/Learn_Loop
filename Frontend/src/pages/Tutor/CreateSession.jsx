import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/sessions";
const TUTOR_BASE = "http://localhost:5000/api/tutors";

const CreateSession = () => {
  const [tutorId, setTutorId] = useState(""); // DB _id of tutor
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("learnloopUser") || "null");
  const userId = storedUser?._id || storedUser?.id;

  // Fetch tutor DB _id
  useEffect(() => {
    const fetchTutorId = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(`${TUTOR_BASE}/${userId}`);
        setTutorId(res.data._id); // Tutor document _id
      } catch (err) {
        console.error("Failed to fetch tutor:", err);
        setStatusMessage("❌ Cannot find tutor profile. Please create it first.");
      }
    };
    fetchTutorId();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !date || !time) {
      setStatusMessage("⚠️ Please fill all fields.");
      return;
    }

    if (!tutorId) {
      setStatusMessage("❌ Tutor ID not found. Cannot create session.");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/create`, {
        tutor_id: tutorId,
        title,
        description,
        date,
        time,
      });
      console.log("Session created:", res.data);
      setStatusMessage("✅ Session created successfully!");
      setTitle(""); setDescription(""); setDate(""); setTime("");
    } catch (err) {
      console.error("Create session error:", err.response?.data || err);
      setStatusMessage("❌ Failed to create session.");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Create a New Session</h2>
      {statusMessage && <p className="mb-4 text-red-600">{statusMessage}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Session Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Create Session
        </button>
      </form>
    </div>
  );
};

export default CreateSession;
