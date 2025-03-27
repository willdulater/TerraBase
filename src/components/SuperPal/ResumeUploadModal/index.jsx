import React, { useState } from "react";

const ResumeUploadModal = ({ onClose, onUpload }) => {
  const [resumeText, setResumeText] = useState("");

  // Handle Manual Input
  const handleTextSubmit = () => {
    if (resumeText.trim() !== "") {
      onUpload({ extractedText: resumeText });
      onClose(); // Close modal after upload
    }
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h2>📄 Upload Resume</h2>
        <input type="file" accept=".pdf,.docx" onChange={(e) => onUpload(e.target.files[0])} style={styles.input} />
        <p>OR</p>
        <textarea
          placeholder="Paste resume text here..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          style={styles.textarea}
        />
        <button onClick={handleTextSubmit} style={styles.uploadButton}>
          Submit Resume
        </button>
        <button onClick={onClose} style={styles.closeButton}>Close</button>
      </div>
    </div>
  );
};

// Styles
const styles = {
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    width: "400px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  textarea: {
    width: "100%",
    height: "80px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    marginTop: "10px",
  },
  uploadButton: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#0073b1",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
  closeButton: {
    marginTop: "10px",
    background: "#ccc",
    border: "none",
    padding: "8px",
    cursor: "pointer",
  },
};

export default ResumeUploadModal;
