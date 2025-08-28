import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";
import LoginPageVideo from "./Images/login.mp4"; // Adjust the path if necessary

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/users/login", {
        gmail: gmail,
        password: password,
      });

      const { user } = response.data; // backend sends { message, user }
      console.log("Login successful:", user);

      // ✅ Save user info in localStorage
      localStorage.setItem("learnloopUser", JSON.stringify(user));
      localStorage.setItem("user_id", String(user.id));
      localStorage.setItem("username", user.username || user.name); // store name

      // ✅ Navigate based on role
      if (user.role === "learner") {
        navigate("/learner-dashboard", { state: { username: user.username || user.name } });
      } else if (user.role === "tutor") {
        navigate("/tutor-dashboard", { state: { username: user.username || user.name } });
      } else {
        setError("Unknown user role");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Side - Video */}
      <div className="hidden md:block w-1/2 h-full">
        <video
          src={LoginPageVideo}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white">
        <div className="w-full max-w-sm p-8 rounded-xl shadow-lg border border-gray-200">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-green-700">LearnLoop</h1>
            <p className="text-sm text-gray-500 mt-1">Empowering Peer Learning</p>
          </div>

          <div className="mb-6 text-center">
            <p className="text-sm text-gray-600">Welcome Back</p>
            <h2 className="text-2xl font-semibold text-black">Log In</h2>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Enter your email"
              value={gmail}
              onChange={(e) => setGmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              className="block text-center w-full py-2 bg-green-700 text-white font-semibold rounded-md hover:bg-green-800 transition duration-200"
            >
              Log In
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            New to Learn Loop?{" "}
            <Link to="/signup" className="text-green-700 font-medium hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
