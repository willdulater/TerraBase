import React from "react";
import "./style.css"; // Add CSS for styling

const Awards = ({ data }) => {
  if (!data || !Array.isArray(data)) {
    return (
    <div className="awards-card">

<div className="awards-header">
        <img
          src="awards.png"
          alt="Awards Icon"
          className="awards-icon"
        />
        <h2>Awards</h2>
      </div>
    <p>None</p>
    </div>
    );
  }

  return (
    <div className="awards-card">
      <div className="awards-header">
        <img
          src="awards.png"
          alt="Awards Icon"
          className="awards-icon"
        />
        <h2>Awards</h2>
      </div>

      <ol className="awards-list">
        {data.map((award, index) => (
          <li key={index}>{award}</li>
        ))}
      </ol>
    </div>
  );
};



export default Awards;
