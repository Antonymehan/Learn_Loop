import React, { useState, useEffect } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const UpdateProfilePage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.lordicon.com/lordicon.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!role) {
      setError("Please select a role.");
      return;
    }
    setError("");
    // handle profile update logic here
  };

  return (
    <div className="h-screen w-screen flex bg-gradient-to-br from-green-100 via-white to-green-50 overflow-hidden">
      {/* Left - Headline */}
      <div className="hidden md:flex w-1/2 flex-col justify-center items-start ml-20 pr-16 text-left">
        <h1 className="text-6xl font-extrabold text-green-800 leading-tight mb-4">
          Update Your <br /> Profile Details
        </h1>
        <p className="text-lg text-gray-600">
          Keep your information up to date and make the most of your LearnLoop
          experience.
        </p>
      </div>

      {/* Right - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4">
        <div className="bg-white border-2 border-green-200 shadow-xl rounded-2xl px-6 py-5 w-full max-w-md">
          <div className="text-center mb-2">
            <h1 className="text-2xl font-bold text-green-700">LearnLoop</h1>
            <p className="text-xs text-gray-500">Edit Your Information</p>
          </div>
          <div className="flex justify-center mb-3">
            <lord-icon
              src="https://cdn.lordicon.com/zpxybbhl.json"
              trigger="loop"
              style={{ width: "48px", height: "48px" }}
            ></lord-icon>
          </div>

          <h2 className="text-lg font-semibold text-center text-black mb-3">
            Update Profile
          </h2>

          <form className="space-y-4" onSubmit={handleUpdate}>
            <input
              type="text"
              placeholder="Update your name"
              className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
              required
            />
            <input
              type="email"
              placeholder="Update your email"
              className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
              required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Update your password"
                className="w-full px-3 py-1.5 pr-10 border border-gray-300 rounded text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={18} />
                ) : (
                  <AiOutlineEye size={18} />
                )}
              </button>
            </div>

            <textarea
              className="w-full rounded border border-gray-300  px-3 py-2 text-base text-gray-800 outline-none focus:ring-2 focus:ring-[#26b49a] transition min-h-[100px]"
              id="description"
              placeholder="Bio"
            />

            {error && (
              <p className="text-sm text-red-600 font-medium -mt-2">{error}</p>
            )}
            <button
              type="submit"
              className="w-full py-2 bg-green-700 text-white text-sm font-medium rounded hover:bg-green-800 transition"
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfilePage;
