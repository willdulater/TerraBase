import React from "react";
import { motion } from "framer-motion";

const EssayDisplay = ({ essay, toggleSave }) => {
  if (!essay) {
    return (
      <div style={{ 
        textAlign: "center", 
        padding: "40px", 
        fontSize: "16px", 
        color: "#666",
        backgroundImage: "url('/api/placeholder/400/320')",
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        opacity: 0.7
      }}>
        <div style={{ 
          backgroundColor: "rgba(255, 255, 255, 0.8)", 
          padding: "20px", 
          borderRadius: "10px" 
        }}>
          <p>Select an essay to view details.</p>
        </div>
      </div>
    );
  }

  const formatEssayType = (type) => {
    switch (type?.toLowerCase()) {
      case "commonapp":
        return "Common App Essay";
      case "shortquestion":
        return "Short Answer";
      case "supplemental":
        return "Supplemental Essay";
      default:
        return type;
    }
  };

  const calculateWordCount = (text) => {
    return text ? text.split(/\s+/).length : 0;
  };

  // Generate a thematic image based on essay type or category
  const getThematicImage = () => {
    if (essay.type?.toLowerCase() === "commonapp") {
      return "/api/placeholder/120/120"; // Common app icon
    } else if (essay.type?.toLowerCase() === "supplemental") {
      return "/api/placeholder/120/120"; // Supplemental essay icon
    } else {
      return "/api/placeholder/120/120"; // Default icon
    }
  };

  // Generate decorative icons based on essay category
  const getCategoryIcon = () => {
    const category = essay.category?.toLowerCase() || "";
    if (category.includes("leadership")) {
      return "👑"; // Leadership icon
    } else if (category.includes("community")) {
      return "🤝"; // Community icon
    } else if (category.includes("challenge")) {
      return "🏆"; // Challenge icon
    } else if (category.includes("creativity")) {
      return "🎨"; // Creativity icon
    } else if (category.includes("diversity")) {
      return "🌍"; // Diversity icon
    } else {
      return "📝"; // Default essay icon
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
        marginBottom: "20px",
        maxWidth: "800px",
        margin: "auto",
        backgroundImage: "linear-gradient(to bottom right, rgba(240, 240, 255, 0.5), rgba(255, 255, 255, 0.8))",
      }}
    >
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "15px",
        borderBottom: "1px solid #e0e0e0",
        paddingBottom: "15px"
      }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img 
            src={getThematicImage()} 
            alt="Essay Type Icon" 
            style={{ 
              width: "40px", 
              height: "40px", 
              marginRight: "15px",
              borderRadius: "50%",
              border: "2px solid #3498db"
            }} 
          />
          <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "#2c3e50" }}>Essay Details</h2>
        </div>
        <button
          style={{
            backgroundColor: essay.is_saved ? "#2ecc71" : "#0073b1",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            transition: "all 0.2s ease",
          }}
          onClick={() => toggleSave(essay.essay_id)}
        >
          {essay.is_saved ? "🔖 Saved" : "☆ Save Essay"}
        </button>
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(3, 1fr)", 
        gap: "20px", 
        marginBottom: "24px",
        backgroundColor: "rgba(236, 240, 241, 0.5)",
        padding: "15px",
        borderRadius: "8px"
      }}>
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          borderRight: "1px dashed #bdc3c7"
        }}>
          <img 
            src="/api/placeholder/70/70" 
            alt="School Logo" 
            style={{ 
              width: "70px", 
              height: "70px", 
              marginBottom: "10px",
              borderRadius: "8px"
            }} 
          />
          <h3 style={{ fontSize: "12px", color: "#7f8c8d", textTransform: "uppercase" }}>School</h3>
          <p style={{ fontSize: "16px", color: "#34495e", fontWeight: "500" }}>{essay.school || "N/A"}</p>
        </div>
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          borderRight: "1px dashed #bdc3c7"
        }}>
          <div style={{ 
            width: "70px",
            height: "70px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            backgroundColor: "#3498db",
            color: "white",
            borderRadius: "8px",
            marginBottom: "10px"
          }}>
            {formatEssayType(essay.type).charAt(0)}
          </div>
          <h3 style={{ fontSize: "12px", color: "#7f8c8d", textTransform: "uppercase" }}>Essay Type</h3>
          <p style={{ fontSize: "16px", color: "#34495e", fontWeight: "500" }}>{formatEssayType(essay.type)}</p>
        </div>
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center"
        }}>
          <div style={{ 
            width: "70px",
            height: "70px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "36px",
            backgroundColor: "#f0f0f0",
            borderRadius: "8px",
            marginBottom: "10px"
          }}>
            {getCategoryIcon()}
          </div>
          <h3 style={{ fontSize: "12px", color: "#7f8c8d", textTransform: "uppercase" }}>Category</h3>
          <p style={{ fontSize: "16px", color: "#34495e", fontWeight: "500" }}>{essay.category || "N/A"}</p>
        </div>
      </div>

      {essay.question && (
        <div style={{ 
          backgroundColor: "#f5f7fa", 
          padding: "20px", 
          borderRadius: "10px", 
          marginBottom: "24px",
          borderLeft: "4px solid #3498db",
          display: "flex",
          alignItems: "flex-start"
        }}>
          <img 
            src="/api/placeholder/60/60" 
            alt="Prompt Icon" 
            style={{ 
              width: "40px", 
              height: "40px", 
              marginRight: "15px",
              borderRadius: "6px"
            }} 
          />
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#2c3e50", marginBottom: "8px" }}>Prompt</h3>
            <p style={{ fontSize: "15px", color: "#34495e", fontStyle: "italic", lineHeight: "1.5" }}>{essay.question}</p>
          </div>
        </div>
      )}

      <div style={{ 
        backgroundColor: "#ffffff", 
        padding: "24px", 
        borderRadius: "10px", 
        boxShadow: "0 3px 10px rgba(0, 0, 0, 0.08)", 
        border: "1px solid #dfe6e9",
        position: "relative"
      }}>
        <div style={{
          position: "absolute",
          top: "-15px",
          left: "20px",
          backgroundColor: "#e74c3c",
          color: "white",
          padding: "5px 15px",
          borderRadius: "20px",
          fontSize: "14px",
          fontWeight: "bold",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
        }}>
          Essay Content
        </div>
        
        <div style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "20px"
        }}>
          <div style={{
            flex: "1",
            position: "relative"
          }}>
            <p style={{ 
              fontSize: "16px", 
              color: "#34495e", 
              lineHeight: "1.8", 
              whiteSpace: "pre-wrap",
              textAlign: "justify"
            }}>
              {essay.essay}
            </p>
            
            {/* Decorative elements */}
            <div style={{ 
              position: "absolute", 
              top: "10px", 
              right: "-10px", 
              fontSize: "20px",
              opacity: 0.2
            }}>
              "
            </div>
            <div style={{ 
              position: "absolute", 
              bottom: "10px", 
              left: "-10px", 
              fontSize: "20px",
              opacity: 0.2
            }}>
              "
            </div>
          </div>
          
          <div style={{
            width: "100px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "15px"
          }}>
            <img 
              src="/api/placeholder/80/80" 
              alt="Essay Illustration 1" 
              style={{ borderRadius: "6px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }} 
            />
            <img 
              src="/api/placeholder/80/80" 
              alt="Essay Illustration 2" 
              style={{ borderRadius: "6px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }} 
            />
            <img 
              src="/api/placeholder/80/80" 
              alt="Essay Illustration 3" 
              style={{ borderRadius: "6px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }} 
            />
          </div>
        </div>
        
        <div style={{ 
          marginTop: "20px", 
          padding: "10px", 
          backgroundColor: "#f8f9fa", 
          borderRadius: "6px", 
          display: "flex", 
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "8px" 
          }}>
            <img 
              src="/api/placeholder/24/24" 
              alt="Word Count Icon" 
              style={{ width: "24px", height: "24px" }} 
            />
            <span style={{ fontSize: "14px", color: "#7f8c8d" }}>
              Word Count: ~{calculateWordCount(essay.essay)}
            </span>
          </div>
          
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "8px" 
          }}>
            <img 
              src="/api/placeholder/24/24" 
              alt="Date Icon" 
              style={{ width: "24px", height: "24px" }} 
            />
            <span style={{ fontSize: "14px", color: "#7f8c8d" }}>
              Last Updated: {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EssayDisplay;