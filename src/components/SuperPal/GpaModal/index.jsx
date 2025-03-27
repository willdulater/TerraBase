import React, { useState } from "react";
import "./gpa.css"; // Link to the CSS file for styling
import { useAuth0 } from "@auth0/auth0-react";
import toast from "react-hot-toast";
import Request from "../../Request/index.jsx";
const GpaModal = ({
  onClose,
  setUnweightedGpa,
  sat,
  act,
  unweightedGpa,
  change,
  setChange,
}) => {
  const { user } = useAuth0();
  const [gpaInput, setGpaInput] = useState("");

  const [satScore, setSatScore] = useState(sat);
  const [actScore, setActScore] = useState(act);

 // const [rank, total] = userRank.split("/");

  const [estimatedGpa, setEstimatedGpa] = useState(unweightedGpa);
  const [manualInput, setManualInput] = useState(false);
//  const [classRank, setClassRank] = useState(rank); // State for class rank
 // const [classSize, setClassSize] = useState(total); // State for class size

  const grades = [
    { grade: "A+, A", range: "4.0" },
    { grade: "A, A-", range: "3.8–4.0" },
    { grade: "A-, B+", range: "3.5–3.8" },
    { grade: "B+, B", range: "3.3–3.4" },
    { grade: "B, B-", range: "3.0–3.2" },
    { grade: "B-, C+", range: "2.7–2.9" },
    { grade: "C+, C", range: "2.3–2.6" },
    { grade: "C, D+", range: "2.0–2.2" },
    { grade: "D+, D", range: "1.7–1.9" },
    { grade: "D, D-", range: "1.0–1.6" },
  ];

  function getGrade(gpa) {
    // If GPA is a range, calculate the average
    if (typeof gpa === "string" && gpa.includes("-")) {
      const [mingpa, maxgpa] = gpa.split("-").map(parseFloat);
      gpa = (mingpa + maxgpa) / 2; // Average of the range
    }

    // Ensure GPA is a number
    gpa = parseFloat(gpa);

    console.log("Converted GPA:", gpa);

    for (const { grade, range } of grades) {
      if (range.includes("–")) {
        const [min, max] = range.split("–").map(parseFloat);
        if (gpa >= min && gpa <= max) {
          return grade;
        }
      } else if (parseFloat(range) === gpa) {
        return grade;
      }
    }

    return "Grade not found"; // Default if GPA is out of range
  }

  const [selectedGrade, setSelectedGrade] = useState(getGrade(unweightedGpa));

  const handleGradeSelect = (grade, range) => {
    setSelectedGrade(grade);
    setEstimatedGpa(range);
  };

  const handleManualInput = () => {
    setManualInput(true);
  };

  const handleSave = (e) => {
    e.preventDefault();

  //  const rank = classRank && classSize ? `${classRank}/${classSize}` : null;

    const threadRequest = new Request("users/" + user.sub + "/edit/", {
      method: "POST",
      data: {
        sat_score: satScore,
        act_score: actScore,
        unweighted_gpa: estimatedGpa || "N/A",
      },
    });
    threadRequest
      .then((res) => {
        toast.success("Successfully Updated Academic Info");
        setChange(!change);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to Update Academic Info");
      });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <div className="optional-fields">
          <div className="field-container">
            <label htmlFor="satScore">SAT </label> (Optional)

            <input
              type="number"
              id="satScore"
              placeholder="Input SAT (0-1600)"
              className="input-field"
              value={satScore !== 0 ? satScore : ""}
              onChange={(e) => setSatScore(e.target.value)}
              min="0"
              max="1600"
            />
          </div>

          <div className="field-container">
            <label htmlFor="actScore">ACT</label> (Optional)
            <input
              type="number"
              id="actScore"
              placeholder="Input ACT (0-35)"
              className="input-field"
              value={actScore !== 0 ? actScore : ""}
              onChange={(e) => setActScore(e.target.value)}
              min="0"
              max="35"
            />
          </div>
        </div>

        {/* GPA Input Section */}
        <div className="gpa-section">
          
          <label>Unweighted GPA*</label>
          
          {!manualInput ? (
            <>
              <p>What grades do you usually get?</p>
              <div className="grade-buttons">
                {grades.map(({ grade, range }) => (
                  <button
                    key={grade}
                    className={`grade-btn ${
                      selectedGrade === grade ? "selected" : ""
                    }`}
                    onClick={() => handleGradeSelect(grade, range)}
                  >
                    {grade}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="field-container-gpa">
              <input
                type="number"
                className="input-field"
                placeholder="Input GPA"
                value={estimatedGpa}
                onChange={(e) => setEstimatedGpa(e.target.value)}
              />
            </div>
          )}

          {/* Estimation Section */}
          {!manualInput && (
            <div className="gpa-estimation">
              <p>
                Your estimated GPA: <strong>{estimatedGpa}</strong>
              </p>

              <button className="manual-input-btn" onClick={handleManualInput}>
                I’d rather input my GPA myself
              </button>
            </div>
          )}
        </div>

        {/* Optional Fields */}

        {/*
<div className="optional-fields">
  <div className="field-container">
    <label htmlFor="classRank">Class rank (optional)</label>
    <input
      type="number"
      id="classRank"
      placeholder="Enter class rank"
      value={classRank}
      onChange={(e) => setClassRank(e.target.value)}
      min="1"
    />
  </div>

  <div className="field-container">
    <label htmlFor="classSize">Class size (optional)</label>
    <input
      type="number"
      id="classSize"
      placeholder="Enter class size"
      value={classSize}
      onChange={(e) => setClassSize(e.target.value)}
      min="1"
    />
  </div>
</div>
*/}

        {/* Save Button */}
        <button className="save-btn" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default GpaModal;
