import React from "react";
import Awards from "./Awards";
import Academics from "./Academics";
import Extracurriculars from "./Extracurriculars";
import Demographics from "./Demographics";

import Decisions from "./Decisions";
import StandardizedTests from "./StandardizedTests";
import Recommendations from "./Recommendations";
import Interviews from "./Interviews";
import Essays from "./Essays";
import "./style.css"; // Optional styling file
import studentData from "../studentData";


import Overview from "./Overview";

const Profile = ({ 

  selectedStudentId,
  setSelectedStudentId,

}) => {

  const student = studentData.find(
    (student) => student.id === selectedStudentId
  );

  return (
  <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
    {/* Main Sidebar */}
    <div
      style={{
        width: "200px",
        backgroundColor: "#f8f9fa",
        padding: "20px",
        borderRight: "1px solid #ddd",
        height: "100vh",
        overflowY: "auto", // Ensures only this section scrolls
      }}
    >
      <h2><b>Students</b></h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {studentData.map((student) => (
          <li
            key={student.id}
            style={{
              padding: "10px",
              cursor: "pointer",
              borderRadius: "5px",
              backgroundColor:
                student.id === selectedStudentId ? "#C8E4FC" : "transparent",
            }}
            onClick={() => setSelectedStudentId(student.id)}
          >
            Profile #{student.id}
          </li>
        ))}
      </ul>
    </div>

    {/* Main Content */}
    <div
      style={{
        flex: 1,
        overflowY: "auto", // Ensures this section scrolls independently
        padding: "20px",
      }}
    >
      {student ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Overview Section */}
          <Overview
            data={student.demographics}
            tags={student.flair}
          />

          {/* Main Columns */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr 1fr", // Three columns: 1:2:1 ratio
              gap: "20px",
            }}
          >
            {/* Column 1: Awards & Academics */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <Awards data={student.awards} />
              <Academics
                data={student.academics}
                
              />
            </div>

            {/* Column 2: Extracurriculars */}
            <div>
              <Extracurriculars data={student.extracurricular_activities} />
            </div>

            {/* Column 3: Decisions */}
            <div>
              <Decisions data={student.decisions} />
            </div>
          </div>
        </div>
      ) : (
        <p>No student selected.</p>
      )}
    </div>
  </div>
);


};

export default Profile;
