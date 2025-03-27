import PaperPlane from "../../../svg/paperplane.svg";
import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";

const CenterForm = ({
  sendCommand,
  deleteGeneration,
  regenerateGeneration,
  delilahWorking,
  getThreadGenerations,
  sendCreate,
}) => {
  const [textFieldValue, setTextFieldValue] = useState(""); // User prompt input
  const [textFieldValue2, setTextFieldValue2] = useState(""); // Supplemental question input
  const [error, setError] = useState("");

  const maxWordCount = 200;

  const handleInputChange = (e, setValue) => {
    const words = e.target.value.trim().split(/\s+/);
    if (words.length <= maxWordCount || e.target.value === "") {
      setValue(e.target.value);
    }
  };

  const submitForm = (e) => {
    e.preventDefault();

    if (textFieldValue.trim().length === 0 || textFieldValue2.trim().length === 0) {
      setError("Both fields are required");
      return;
    }

    setError("");
    sendCreate("command", `Prompt: ${textFieldValue2}\n\nContext: ${textFieldValue}`);
  };

  return (
    <form
      onSubmit={submitForm}
      className="w-full max-w-5xl mb-8 mx-auto bg-white rounded-2xl p-6 shadow-md border border-gray-300"
      style={{
        fontFamily: "'Poppins', sans-serif",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Input and Buttons Section */}
      <div className="flex flex-row gap-6 items-center">
        {/* Supplemental Question Input */}
        <div className="flex-1">
          <label className="font-bold text-gray-700 mb-2 block uppercase tracking-wide text-sm">
            Supplemental Question
          </label>
          <TextareaAutosize
            className="w-full border border-gray-300 rounded-lg p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            type="text"
            value={textFieldValue2}
            onChange={(e) => handleInputChange(e, setTextFieldValue2)}
            placeholder="Enter the supplemental question here..."
            disabled={delilahWorking}
            maxRows={3}
            minRows={2}
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {textFieldValue2.trim().split(/\s+/).filter(Boolean).length}/{maxWordCount} words
          </div>
        </div>

        {/* User Prompt Input */}
        <div className="flex-1">
          <label className="font-bold text-gray-700 mb-2 block uppercase tracking-wide text-sm">
            Your Input
          </label>
          <TextareaAutosize
            className="w-full border border-gray-300 rounded-lg p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            type="text"
            value={textFieldValue}
            onChange={(e) => handleInputChange(e, setTextFieldValue)}
            placeholder="Write your input or response here..."
            disabled={delilahWorking}
            maxRows={3}
            minRows={2}
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {textFieldValue.trim().split(/\s+/).filter(Boolean).length}/{maxWordCount} words
          </div>
        </div>

        {/* Send Button Section */}
        <div className="flex justify-center items-center">
          <AwesomeButton
            type="primary"
            disabled={delilahWorking || textFieldValue.trim() === "" || textFieldValue2.trim() === ""}
            style={{
              "--button-primary-color": textFieldValue.trim() && textFieldValue2.trim()
                ? "#2563eb"
                : "#e0e0e0", // Active/disabled color
              "--button-primary-color-dark": "#1e40af",
              "--button-primary-color-light": "#bfdbfe",
              "--button-primary-color-hover": textFieldValue.trim() && textFieldValue2.trim()
                ? "#1e40af"
                : "#e0e0e0",
              "--button-primary-color-active": "#1e3a8a",
            }}
            className="transition-transform transform hover:scale-105"
          >
            <img src={PaperPlane} alt="Send" className="h-5 w-5 mr-2" />
            Send
          </AwesomeButton>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-600 font-semibold mt-2 text-left animate-bounce">
          {error}
        </div>
      )}
    </form>
  );
};

export default CenterForm;
