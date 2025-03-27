import React, { useState, useEffect } from "react";

const EssayGrader2 = ({ handleRating, ratingData }) => {
  const categories = [
    "vulnerability",
    "selflessness",
    "perseverance",
    "initiative",
    "curiosity",
    "expression",
  ];

  const [scores, setScores] = useState({
    overall: 0,
    vulnerability: 0,
    selflessness: 0,
    perseverance: 0,
    initiative: 0,
    curiosity: 0,
    expression: 0,
  });

  const calculateOverallScore = (scoresObj) => {
    const totalScore = categories.reduce((sum, category) => sum + (scoresObj[category] || 0), 0);
    const averageScore = totalScore / categories.length;
    return Math.round(averageScore); // Round to nearest whole number
  };

  useEffect(() => {
    if (ratingData) {
      const updatedScores = {
        overall: calculateOverallScore(ratingData.scores || {}),
        ...categories.reduce((acc, category) => {
          acc[category] = ratingData.scores?.[category.toLowerCase()] || 0;
          return acc;
        }, {}),
      };
      setScores(updatedScores);
    }
  }, [ratingData]);

  const [animatedScores, setAnimatedScores] = useState(
    categories.reduce(
      (acc, category) => ({ ...acc, [category]: 0, overall: 0 }),
      {}
    )
  );

  useEffect(() => {
    // Reset scores to 0 when scores change
    setAnimatedScores((prev) => ({
      ...prev,
      ...categories.reduce((acc, category) => ({ ...acc, [category]: 0, overall: 0 }), {}),
    }));

    // Animate to actual scores after a short delay
    const timeout = setTimeout(() => {
      setAnimatedScores(scores);
    }, 300);

    return () => clearTimeout(timeout); // Clean up timeout
  }, [scores]);

  // Helper function to determine bar color based on score
  const getBarColor = (score) => {
    if (score >= 90) return "bg-blue-500";
    if (score >= 80) return "bg-green-500"; // High scores
    if (score >= 60) return "bg-yellow-500"; // Medium scores
    if (score >= 40) return "bg-orange-500"; // Low scores
    return "bg-red-500"; // Very low scores
  };

  return (
    <div className="w-full h-full p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg flex flex-col items-center overflow-y-auto">
      {/* Overall Score */}
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-4 rounded-md shadow mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 text-center mb-3">
          Overall Score
        </h2>
        <div className="flex items-center justify-center">
          <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded-full w-full max-w-xs relative">
            <div
              className={`absolute h-full ${getBarColor(animatedScores.overall)} rounded-full transition-all duration-500`}
              style={{ width: `${animatedScores.overall}%` }}
            ></div>
          </div>
          <span className="text-sm font-bold text-gray-800 dark:text-gray-200 ml-3">
            {animatedScores.overall}
          </span>
        </div>
      </div>

      {/* Evaluation Panel */}
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-4 rounded-md shadow">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 text-center mb-4">
          Essay Evaluation
        </h2>

        {/* Render All Categories */}
        {categories.map((category) => (
          <div key={category} className="mb-4">
            {/* Category Header */}
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 capitalize">
                {category}
              </span>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                {animatedScores[category]}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded-full relative">
              <div
                className={`absolute h-full ${getBarColor(animatedScores[category])} rounded-full transition-all duration-500`}
                style={{ width: `${animatedScores[category]}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EssayGrader2;
