import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    gmail: "",
    password: "",
    profile: "",
    age: "",
    role: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.lordicon.com/lordicon.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.role) {
      setError("Please select a role.");
      return;
    }
    setError("");

    try {
      const payload = {
        name: formData.name,
        gmail: formData.gmail,
        password: formData.password,
        profile: formData.profile,
        age: Number(formData.age),
        role: formData.role
      };

      await axios.post("http://localhost:5000/api/users/register", payload);

      alert("Signup successful!");
      navigate("/login");
    } catch (err) {
      console.error("Signup failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="h-screen w-screen flex bg-gradient-to-br from-green-100 to-green-50 overflow-hidden">
      <div className="w-full md:w-1/2 flex items-center justify-center px-4">
        <div className="border-2 border-green-200 shadow-xl rounded-2xl px-6 py-5 w-full max-w-md">
          <div className="text-center mb-2">
            <h1 className="text-2xl font-bold text-green-700">LearnLoop</h1>
            <p className="text-xs text-gray-500">Let's Get You Started</p>
          </div>
          <div className="flex justify-center mb-3">
            <lord-icon
              src="https://cdn.lordicon.com/zpxybbhl.json"
              trigger="loop"
              style={{ width: "48px", height: "48px" }}
            ></lord-icon>
          </div>

          <h2 className="text-lg font-semibold text-center text-black mb-3">
            Create an Account
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400" required />
            <input type="email" name="gmail" value={formData.gmail} onChange={handleChange} placeholder="Enter your email" className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400" required />

            <div className="relative">
              <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" className="w-full px-3 py-1.5 pr-10 border border-gray-300 rounded text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                {showPassword ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
              </button>
            </div>

            <input type="text" name="profile" value={formData.profile} onChange={handleChange} placeholder="Enter your profile (URL)" className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400" />
            <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Enter your age" className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400" required />

            <select name="role" value={formData.role} onChange={handleChange} className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400" required>
              <option value="">Select Role</option>
              <option value="learner">Learner</option>
              <option value="tutor">Tutor</option>
            </select>

            {error && <p className="text-sm text-red-600 font-medium -mt-2">{error}</p>}

            <button type="submit" className="w-full py-2 bg-green-700 text-white text-sm font-medium rounded hover:bg-green-800 transition">
              Sign Up
            </button>
          </form>

          <p className="text-center text-xs text-gray-600 mt-4">
            Already have an account? <Link to="/login" className="text-green-700 font-medium hover:underline">Log in here</Link>
          </p>
        </div>
      </div>

      <div className="hidden md:flex w-1/2 flex-col justify-center items-start pl-10 pr-16 text-left">
        <h1 className="text-7xl font-extrabold text-green-800 leading-tight mb-4">Empower Learning,<br />Share Knowledge</h1>
        <p className="text-lg text-gray-600">Join the LearnLoop community and become a part of the free peer-to-peer learning revolution.</p>
      </div>
    </div>
  );
};

export default SignupPage;
