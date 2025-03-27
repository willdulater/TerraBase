import React from "react";
import "./style.css"; // Add CSS for styling

const Extracurriculars = ({ data }) => {

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (<div className="extracurriculars-card">
      <div className="extracurriculars-header">
        <img
          src="ecs.png" // Replace with your extracurricular icon path
          alt="Extracurriculars Icon"
          className="extracurriculars-icon"
        />
        <h2>Extracurricular Activities</h2>
      </div>
      None</div>
      );
  }

  return (
    <div className="extracurriculars-card">
      {/* Header with Icon */}
      <div className="extracurriculars-header">
        <img
          src="ecs.png" // Replace with your extracurricular icon path
          alt="Extracurriculars Icon"
          className="extracurriculars-icon"
        />
        <h2>Extracurricular Activities</h2>
      </div>

      {/* Extracurriculars List */}
      <ol className="extracurriculars-list">
  {data.map((activity, index) => (
    <li key={index}>
      {activity.title && activity.description !== null ? (
        <>
          <strong>{activity.title}:</strong> {activity.description}
        </>
      ) : (
        <>{activity.title}</>
      )}
    </li>
  ))}
</ol>

    </div>
  );
};

export default Extracurriculars;
