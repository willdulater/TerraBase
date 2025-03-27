import React from "react";
import "./style.css"; // Add CSS for proper layout and styling

const Overview = ({ data, tags }) => {
  return (
    <div className="overview-horizontal-container">
      {/* Left icon */}
      <div className="overview-search-icon"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          width: "40px", // Adjust as needed
          height: "40px",
        }}>
      <img
            src="search.svg"
            alt="search"
            className="gender-icon"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
            }}
          />
        {/* Replace with your actual icon path */}
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
            {/*  <span>
              <strong>Income:</strong> {data.income_bracket ?? "N/A"}
            </span>*/}
          </div>
          <div className="details-right">
            <span>
              <strong>Race:</strong> {data.race_ethnicity ?? "N/A"}
            </span>
            <span>
              <strong>Gender:</strong>{" "}
              <span className="gender-text">{data.gender ?? "null"}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Right gender icon */}
      <div
        className="overview-gender-icon"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "40px", // Adjust as needed
          height: "40px",
        }}
      >
        {data.gender && data.gender.toLowerCase() === "male" ? (
          <img
            src="male.svg"
            alt="Male"
            className="gender-icon"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain", // Ensures proper scaling
              display: "block", // Prevents extra spacing
            }}
          />
        ) : data.gender && data.gender.toLowerCase() === "female" ? (
          <img
            src="female.svg"
            alt="Female"
            className="gender-icon"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
            }}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Overview;
