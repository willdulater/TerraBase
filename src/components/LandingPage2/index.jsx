import React, { useState } from "react";

const LandingPageMain = ({
  setSelectedMode,
  selectedMode,
  setShowTemplateSelector,
  setShowInterviewModal,
}) => {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div style={styles.container}>
      {/* Welcome Section */}
      <div style={styles.header}>
        <h1 style={styles.title}>Welcome to INTERVIEW</h1>
        <p style={styles.subtitle}>
          You have not created any interviews yet. Press below to get started.
        </p>
      </div>

      {/* Action Buttons */}
      <div style={styles.buttonsContainer}>
        <div style={styles.backgroundDecorations}></div>
        <div style={styles.backgroundDecorations2}></div>




        {/* Interview Card */}
        <div
          style={{
            ...styles.card,
            ...styles.cardBlueShadow,
            ...(hoveredCard === "interview" ? styles.cardSharedHover : {}), // Shared hover style
          }}
          onMouseEnter={() => setHoveredCard("interview")}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={() => {
            setSelectedMode("interview");
            console.log("Selected Mode: ", selectedMode);
            setShowInterviewModal(true);
          }}
        >
          <div style={styles.iconContainer}>
            <img src="ai-interview.svg" alt="Interview Icon" style={styles.icon} />
          </div>
          <h3 style={styles.cardTitle}>Interview</h3>
          <p style={styles.cardDescription}>
            Practice Common Interview Questions
          </p>
        </div>
      </div>

      {/* Footer Section */}
      <div style={styles.footer}>
        <p>
          Need help? Join our <a href="https://discord.gg/EdFAbQxHfh" style={styles.link} target="_blank">Discord</a> community!
        </p>
      </div>
    </div>
  );
};

// Styles
const styles = {


  container: {
    fontFamily: "'Poppins', sans-serif",
    textAlign: "center",
    padding: "20px",
    background: "#ffffff",
    minHeight: "100vh",
    width: "100%", // Ensure full width
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    overflow: "hidden",
  },


  backgroundDecorations: {
    position: "absolute",
    top: "10%",
    left: "-50px",
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    backgroundColor: "#90CAF9",
    opacity: 0.2,
    zIndex: 0,
  },
  backgroundDecorations2: {
    position: "absolute",
    bottom: "10%",
    right: "-50px",
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    backgroundColor: "#007BFF",
    opacity: 0.1,
    zIndex: 0,
  },
  header: {
    marginTop: "50px",
  },
  title: {
    fontSize: "3rem", // Larger and modern
    fontWeight: "700",
    margin: "0 0 10px",
    color: "#333",
  },
  subtitle: {
    fontSize: "1.5rem",
    fontWeight: "400",
    color: "#555",
    margin: "0 0 30px",
  },
  buttonsContainer: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%", // Use full width
    maxWidth: "1200px", // Optional: Limit max width for better readability
    margin: "20px auto", // Center the container
    padding: "0 20px", // Add padding for spacing on smaller screens
  },
  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #e0e0e0",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    textAlign: "center",
    flex: "1 1 300px", // Allow cards to grow and shrink evenly
    height: "320px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    minWidth: "250px", // Minimum card width
    maxWidth: "300px", // Maximum card width
  },

  cardBlueShadow: {
    boxShadow: "0 8px 20px 3px #90CAF9", // Default blue shadow for Create
  },
  cardHover: {
    backgroundColor: "#ffffff", // Slightly lighter blue for Create on hover
    boxShadow: "0 12px 24px 5px #FFFFFF", // Enhanced blue shadow on hover
    transform: "scale(1.05)", // Enlarge Create card slightly
  },
  cardSharedHover: {
    transform: "scale(1.05)", // Shared enlarge effect for other cards
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)", // Slightly darker shadow for others
  },
  iconContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "80px",
    width: "80px",
    marginBottom: "10px",
    overflow: "hidden",
  },
  icon: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  cardTitle: {
    fontSize: "1.7rem",
    fontWeight: "600",
    color: "#333",
    margin: "10px 0 5px",
  },
  cardDescription: {
    fontSize: "1rem",
    color: "#666",
    margin: "0",
    lineHeight: "1.4",
  },
  footer: {
    marginTop: "40px",
    fontSize: "1rem",
    color: "#555",
    textAlign: "center",
  },
  link: {
    color: "#007BFF",
    textDecoration: "none",
  },
};

export default LandingPageMain;
