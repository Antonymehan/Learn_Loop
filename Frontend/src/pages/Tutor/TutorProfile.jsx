// Import & Setup
import React, { useState, useEffect } from "react";
import axios from "axios";

const TutorProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    domain: "",
    workexperience: "",
    professional: "",
  });

  const [tutorExists, setTutorExists] = useState(false);
  const storedUser = JSON.parse(localStorage.getItem("learnloopUser"));

  useEffect(() => {
    if (storedUser) {
      axios
        .get(`http://localhost:8083/api/tutor/${storedUser.user_id}`)
        .then((res) => {
          const tutor = res.data;
          setTutorExists(true);
          setProfile({
            name: tutor.user.name,
            domain: tutor.domain,
            workexperience: tutor.workexperience,
            professional: tutor.professional,
          });
        })
        .catch(() => setTutorExists(false));
    }
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        user_id: storedUser.user_id,
        domain: profile.domain,
        workexperience: profile.workexperience,
        professional: profile.professional,
      };

      const url = tutorExists
        ? `http://localhost:8083/api/tutor/${storedUser.user_id}`
        : "http://localhost:8083/api/tutor/create";

      const method = tutorExists ? "put" : "post";

      await axios[method](url, payload);
      alert("✅ Tutor profile saved successfully!");
      setTutorExists(true);
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Failed to save tutor profile.");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md border border-blue-200">
      <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">
        {tutorExists ? "Update Your Profile" : "Create Your Tutor Profile"}
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={profile.name}
          placeholder="Your Name"
          className="w-full px-3 py-2 border rounded text-black bg-gray-100"
          disabled
        />
        <input
          type="text"
          name="domain"
          value={profile.domain}
          onChange={handleChange}
          placeholder="Domain"
          className="w-full px-3 py-2 border rounded text-black"
          required
        />
        <input
          type="text"
          name="workexperience"
          value={profile.workexperience}
          onChange={handleChange}
          placeholder="Work Experience"
          className="w-full px-3 py-2 border rounded text-black"
          required
        />
        <input
          type="text"
          name="professional"
          value={profile.professional}
          onChange={handleChange}
          placeholder="Professional Title"
          className="w-full px-3 py-2 border rounded text-black"
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-700 text-white font-medium rounded hover:bg-blue-800"
        >
          {tutorExists ? "Update Profile" : "Create Profile"}
        </button>
      </form>
    </div>
  );
};

export default TutorProfile;
