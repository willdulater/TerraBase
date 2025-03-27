import React from "react";

const Demographics = ({ data }) => {
  return (
    <div className="demographics">
      <h2>Demographics</h2>
      <p><strong>Gender:</strong> {data.gender}</p>
      <p><strong>Race/Ethnicity:</strong> {data["race/ethnicity"]}</p>
      <p><strong>Residence:</strong> {data.residence}</p>
      <p><strong>Income Bracket:</strong> {data.income_bracket}</p>
      <p><strong>Type of School:</strong> {data.type_of_school}</p>
      <p><strong>Hooks:</strong> {data.hooks}</p>
    </div>
  );
};

export default Demographics;
