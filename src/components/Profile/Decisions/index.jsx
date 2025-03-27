import React from "react";
import "./style.css"; // Add CSS for styling

const Decisions = ({ data }) => {
  if (!data) return null; // Only return null if `data` itself is missing

  return (
    <div className="decisions-container">
      {/* Acceptances Card - Always renders if there are acceptances */}
      {Array.isArray(data.acceptances) && data.acceptances.length > 0 && (
        <div className="decision-card acceptances">
          <div className="decision-header">
            <img
              src="acceptances.png" // Replace with an acceptance icon path
              alt="Accept Icon"
              className="decision-icon"
            />
            <h3>Acceptances</h3>
          </div>
          <ul className="decision-list">
            {data.acceptances.map((school, index) => (
              <li key={index}>{school}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Rejections Card - Only renders if there are valid rejections */}
      {Array.isArray(data.rejections) && data.rejections.length > 0 ? (
        <div className="decision-card rejections">
          <div className="decision-header">
            <img
              src="rejections.png" // Replace with a rejection icon path
              alt="Reject Icon"
              className="decision-icon"
            />
            <h3>Rejections</h3>
          </div>
          <ul className="decision-list">
            {data.rejections.map((school, index) => (
              <li key={index}>{school}</li>
            ))}
          </ul>
        </div>
      ) : (
        
        <div className="decision-card rejections">
          <div className="decision-header">
            <img
              src="rejections.png" // Replace with a rejection icon path
              alt="Reject Icon"
              className="decision-icon"
            />
            <h3>Rejections</h3>
          </div>
       <p>No rejections recorded.</p> 
        </div>
      )}
    </div>
  );
};

export default Decisions;
