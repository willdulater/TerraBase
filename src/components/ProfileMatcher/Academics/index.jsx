import React from "react";
import "./style.css"; // Add CSS for styling

const Academics = ({ 
  data,
  data2,
}) => {
  return (
    <div className="academics-card">
      {/* Header with Icon */}
      <div className="academics-header">
        <img
          src="exam.svg" // Replace with a suitable icon (e.g., graduation cap)
          alt="Academics Icon"
          className="academics-icon"
        />
        <h3>Academics</h3>
      </div>

      {/* Academic Details */}
      <div className="academics-details">
        <p><strong>SAT:</strong> {data.sat || "None"}</p>
        <p><strong>ACT:</strong> {data.act || "None"}</p>
        <p><strong>Unweighted GPA:</strong> {data.unweighted_gpa || "None"}</p>
        <p><strong>Weighted GPA:</strong> {data.weighted_gpa || "None"}</p>
        <p><strong>Rank:</strong> {data.rank || "None"}</p>
        <p><strong>AP Courses:</strong> {data.number_of_ap_courses || "None"}</p>
        <p><strong>IB Courses:</strong> {data.number_of_ib_courses || "None"}</p>
        <p><strong>Honors Courses:</strong> {data.number_of_honors_courses || "None"}</p>
      </div>
    </div>
  );
};

export default Academics;
