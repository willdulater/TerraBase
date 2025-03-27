import React, { useState, useEffect } from "react";

const EssayFeedback = ({ ratingData }) => {
  const [feedback, setFeedback] = useState({}); // State for storing feedback

  // Update feedback when ratingData changes
  useEffect(() => {
    if (ratingData && ratingData.feedback) {
      setFeedback(ratingData.feedback);
    }
  }, [ratingData]);

  return (
    <div className="w-full h-full p-4 overflow-y-auto bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
        Essay Feedback
      </h2>

      {/* Check if feedback exists */}
      {Object.keys(feedback).length > 0 ? (
        <div className="space-y-4">
          {Object.entries(feedback).map(([category, feedbackText]) => (
            <div
              key={category}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
            >
              {/* Category Title */}
              <h3 className="text-lg font-bold capitalize text-gray-700 dark:text-gray-300 mb-2">
                {category}
              </h3>

              {/* Feedback Text */}
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {feedbackText}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 bg-gray-200 dark:bg-gray-700 rounded-md">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            No feedback available.
          </p>
        </div>
      )}
    </div>
  );
};

export default EssayFeedback;
