import React from "react";

const Interviews = ({ data }) => {
  return (
    <div className="interviews">
      <h2>Interviews</h2>
      <ul>
        {data.map((interview, index) => (
          <li key={index}>
            <strong>{interview.school}:</strong> {interview.performance_outcome || "No details provided"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Interviews;
