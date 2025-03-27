import React from "react";

const StandardizedTests = ({ data }) => {
  return (
    <div className="standardized-tests">
      <h2>Standardized Tests</h2>
      <p><strong>SAT:</strong> {data.sat}</p>
      <p><strong>ACT:</strong> {data.act}</p>
      <p><strong>IB:</strong> {data.ib}</p>
      <p><strong>AP Testing:</strong> {data.ap_testing}</p>
    </div>
  );
};

export default StandardizedTests;
