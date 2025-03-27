import React from "react";

const Essays = ({ data }) => {
  return (
    <div className="essays">
      <h2>Essays</h2>
      <p><strong>Common App:</strong> {data.common_app.topic || "No details provided"}</p>
      <p><strong>Supplementals:</strong> {data.supplementals["Topic Overview"] || "No details provided"}</p>
    </div>
  );
};

export default Essays;
