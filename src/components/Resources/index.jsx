import React, { useState } from "react";

const Resources = () => {

  const [hoveredCard, setHoveredCard] = useState(null);
  const resources = [
    {
      title: "Blog",
      description: "Explore articles and insights on college admissions.",
      image: "blog.svg", // Replace with the actual path to your image/icon
    },
    {
      title: "FAQ",
      description: "Find answers to frequently asked questions about applications.",
      image: "faq.svg",
    },
    {
      title: "Summer Programs",
      description: "Discover opportunities to do over the summer.",
      image: "summer.svg",
    },
    {
      title: "Contest Lists",
      description: "Access lists of scholarships and contests for students.",
      image: "contest.svg",
    },
    {
      title: "Contact",
      description: "Reach out to us for support or feedback.",
      image: "contact.svg",
    },
  ];

  const styles = {
    
  container: {
    fontFamily: "'Poppins', sans-serif",
    textAlign: "center",
    padding: "40px 20px",
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
  },
  header: {
    marginBottom: "30px",
  },
  title: {
    fontSize: "3rem",
    fontWeight: "700",
    margin: "0",
    color: "#333",
  },
  subtitle: {
    fontSize: "1.2rem",
    fontWeight: "400",
    color: "#555",
    margin: "10px 0 40px",
  },
  cardsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s, box-shadow 0.2s",
    width: "270px",
    height: "320px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    padding: "20px",
    cursor: "pointer",
  },
  cardHover: {
    transform: "scale(1.05)",
    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
  },
  iconContainer: {
    height: "80px",
    width: "80px",
    marginBottom: "10px",
  },
  icon: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  cardTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#333",
  },
  cardDescription: {
    fontSize: "1rem",
    color: "#666",
    lineHeight: "1.4",
    textAlign: "center",
  },
};
  return (
    <div className="h-screen w-full flex flex-col from-[#F4FAFE] to-[#F4FAFE] bg-gradient-135">
      <div className="flex-1 overflow-y-auto">
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Resources (Work in Progress)</h1>
        <p style={styles.subtitle}>
          Explore helpful tools and guides to navigate your journey.
        </p>
      </div>

      {/* Cards Grid */}
      <div style={styles.cardsContainer}>
        {resources.map((resource, index) => (
          <div
  key={index}
  style={{
    ...styles.card,
    ...(hoveredCard === resource.title ? styles.cardHover : {}), // Merge hover style
  }}
  onMouseEnter={() => setHoveredCard(resource.title)}
  onMouseLeave={() => setHoveredCard(null)}
>
  <div style={styles.iconContainer}>
    <img
      src={resource.image}
      alt={`${resource.title} icon`}
      style={styles.icon}
    />
  </div>
  <h3 style={styles.cardTitle}>{resource.title}</h3>
  <p style={styles.cardDescription}>{resource.description}</p>
</div>
        ))}
      </div>
      </div>
    </div>
    </div>
  );




};

export default Resources;
