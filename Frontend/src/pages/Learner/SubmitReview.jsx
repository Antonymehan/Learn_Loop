import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";

const SubmitReview = () => {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.lordicon.com/lordicon.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Review submitted:", { reviewText, rating });
    setSubmitted(true);
  };

  return (
    <div className="h-screen w-screen flex bg-gradient-to-br from-green-100  to-green-50 overflow-hidden">
      {/* Left - Review Card */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4">
        <div className="border-2 border-green-200 shadow-xl rounded-2xl px-6 py-6 w-full max-w-md">
          {/* Heading & Animation */}
          <div className="text-center mb-2">
            <h1 className="text-2xl font-bold text-green-700">LearnLoop</h1>
            <p className="text-xs text-gray-500">We’d Love Your Feedback</p>
          </div>
          <div className="flex justify-center mb-3">
            <lord-icon
              src="https://cdn.lordicon.com/qhviklyi.json"
              trigger="loop"
              style={{ width: "48px", height: "48px" }}
            ></lord-icon>
          </div>

          <h2 className="text-lg font-semibold text-center text-black mb-3">
            Share Your Session Review
          </h2>

          {/* Review Form */}
          {submitted ? (
            <p className="text-green-600 text-center font-medium">
              ✅ Thank you for your feedback!
            </p>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Rating (1–5):
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Your Review:
                </label>
                <textarea
                  rows="4"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-green-700 text-white text-sm font-medium rounded hover:bg-green-800 transition"
              >
                Submit Review
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Right - Headline */}
      <div className="hidden md:flex w-1/2 flex-col justify-center items-start pl-10 pr-16 text-left">
        <h1 className="text-6xl font-extrabold text-green-800 leading-tight mb-4">
          Reflect. Share.
          <br />
          Help Others Learn Better
        </h1>
        <p className="text-lg text-gray-600">
          Your feedback helps learners and tutors build better learning journeys — thank you for being a part of LearnLoop!
        </p>
      </div>
    </div>
  );
};

export default SubmitReview;
