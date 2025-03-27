import React from "react";

const Recommendations = ({ data }) => {
  return (
    <div className="recommendations">
      <h2>Letters of Recommendation</h2>
      <ul>
        {data.map((rec, index) => (
          <li key={index}>
            <strong>{rec.recommender}:</strong> {rec.relationship_and_quality || "No details provided"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Recommendations;
