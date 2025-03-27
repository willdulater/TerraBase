import React from "react";
import "./style.css"; // Add CSS for proper layout and styling

const Overview = ({ data, tags }) => {
  return (
    <div className="overview-horizontal-container">
      {/* Left icon */}
      <div className="overview-icon">
        <img src="user.png" alt="Icon" /> {/* Replace with your actual icon path */}
      </div>

      {/* Center content */}
      <div className="overview-center">
        <h1 className="overview-title">Overview</h1>
        <div className="tags-container">
          {tags && tags.length > 0
            ? tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))
            : null}
        </div>

        {/* Single row for details */}
        <div className="overview-details">
          <div className="details-left">
            <span>
              <strong>Major:</strong> {data.intended_major ?? "N/A"}
            </span>
            <span>
              <strong>Income:</strong> {data.income_bracket ?? "N/A"}
            </span>
          </div>
          <div className="details-right">
            <span>
              <strong>Race:</strong> {data.race_ethnicity ?? "N/A"}
            </span>
            <span>
              <strong>Gender:</strong>{" "}
              <span className="gender-text">
                {data.gender ?? "null"}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Right gender icon */}
      <div className="overview-gender-icon">
        {data.gender && data.gender.toLowerCase() === "male" ? (
          <span className="gender-icon">♂</span>
        ) : data.gender && data.gender.toLowerCase() === "female" ? (
          <span className="gender-icon-female">♀</span>
        ) : null}
      </div>
    </div>
  );
};

export default Overview;
