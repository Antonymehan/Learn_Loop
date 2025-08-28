import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";

const Feedback = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fakeReviews = [
      { id: 1, learner: "Arjun", comment: "Great session!", rating: 5 },
      { id: 2, learner: "Priya", comment: "Very helpful explanation.", rating: 4 },
    ];
    setReviews(fakeReviews);
  }, []);

  const renderStars = (count) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`text-lg ${
          index < count ? "text-yellow-400" : "text-gray-300"
        } transition duration-300`}
      />
    ));
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">🌟 Learner Feedback</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                {review.learner.charAt(0)}
              </div>
              <p className="text-lg font-semibold text-gray-800">{review.learner}</p>
            </div>
            <p className="text-gray-700 mb-3 italic">"{review.comment}"</p>
            <div className="flex">{renderStars(review.rating)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feedback;
