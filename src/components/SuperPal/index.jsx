import React from "react";
import GpaModal from "./GpaModal"; // Import the GpaModal component
import { useAuth0 } from "@auth0/auth0-react";
import ProfileModal from "./ProfileModal";
import "./style.css"; // CSS file for styling
import { useState, useEffect } from "react";
import ExtracurricularModal from "./ExtracurricularModal";
import AwardsModal from "./AwardsModal";
import InterestsModal from "./InterestsModal";
import toast from "react-hot-toast";
import Request from "../Request/index.jsx";
import ResumeUploadModal from "./ResumeUploadModal/index.jsx";

const SuperPal = ({
  socket,
  gender,
  setGender,
  race,
  setRace,
  intendedMajor,
  setIntendedMajor,
  satScore,
  setSatScore,
  actScore,
  setActScore,
  unweightedGpa,
  setUnweightedGpa,
  extracurriculars,
  setExtracurriculars,
  selectedInterests,
  setSelectedInterests,
  awards,
  setAwards,
  change,
  setChange,
  setSelectedMode,
}) => {
  const { user } = useAuth0();
  const { picture } = user;

  //info popup
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  //modals
  const [isGpaModalOpen, setIsGpaModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [ECModalOpen, setECModalOpen] = useState(false);
  const [isInterestModalOpen, setIsInterestModalOpen] = useState(false);
  const [isAwardsModalOpen, setIsAwardsModalOpen] = useState(false);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);

  const [activityData, setActivityData] = useState({
    isEditing: false,
    name: "",
    description: "",
    id: "",
  });

  const [awardData, setAwardData] = useState({
    isEditing: false,
    title: "",
    id: "",
  });

  const openAwardsModal = (award = null) => {
    if (award) {
      setAwardData({
        isEditing: true,
        title: award.title,
        id: award.id,
      });
    } else {
      setAwardData({
        isEditing: false,
        title: "",
        id: crypto.randomUUID(),
      });
    }
    setIsAwardsModalOpen(true);
  };

  // Handle Delete Award
  const handleDeleteAward = (id) => {
    setAwards((prev) => {
      const updatedAwards = prev.filter((award) => award.id !== id);

      // Send updated awards to backend
      const request = new Request(`users/${user.sub}/edit/`, {
        method: "POST",
        data: { awards: updatedAwards },
      });

      request
        .then(() => {
          toast.success("Successfully updated awards.");
          setChange(!change);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to update awards.");
        });

      return updatedAwards;
    });
  };

  const [userRank, setUserRank] = useState("");

  const handleInterestModalOpen = () => setIsInterestModalOpen(true);

  const handleModalClose = () => setIsInterestModalOpen(false);

  const closeModal = () => {
    setECModalOpen(false);
  };

  const handleSaveInterests = (interests) => {
    setSelectedInterests(interests);
  };

  // Close modal

  const updateProfile = () => {
    // Send the full editor text using the socket with "rating" type
    socket.send(
      JSON.stringify({
        websocket_type: "getprofile",
        id: user.sub,
      })
    );
  };

  const updateEmbedding = () => {
    if (user && user.sub) {
      socket.send(
        JSON.stringify({
          websocket_type: "create_embedding",
          id: user.sub,
        })
      );
    }
  };

  useEffect(() => {
    updateProfile();
    updateEmbedding();
  }, [user.sub, user.email, change]);

  useEffect(() => {
    if (!socket) {
      console.error("WebSocket is null.");
      return;
    }

    socket.onmessage = (e) => {
      //  console.log("Raw message:", e.data);

      const data = JSON.parse(e.data);
      // console.log("Parsed message:", data);

      if (data["error"]) {
        toast.error(data["error"]);
        return;
      }

      if (data.websocket_type === "getprofile") {
        setGender(data["gender"] ?? "Not specified");
        setRace(data["race"] ?? "Not specified");

        setIntendedMajor(data["intended_major"]);

        setSatScore(data["sat_score"]);
        setActScore(data["act_score"]);
        setUnweightedGpa(data["unweighted_gpa"] ?? "N/A");
        setExtracurriculars(data["extracurriculars"] ?? []);
        setAwards(data["awards"] ?? []);

        setSelectedInterests(data["interests"] ?? []);
      }
    };
  }, [socket]);

  const openModal = (activity = null) => {
    if (activity) {
      setActivityData({
        isEditing: activity ? true : false,
        name: activity?.name || "",
        description: activity?.description || "",
        id: activity?.id || "", // ✅ Defaults to an empty string if null
      });
    } else {
      setActivityData({
        isEditing: false,
        name: "",
        description: "",
        id: crypto.randomUUID(), // ✅ Assign a unique ID for new activities
      });
    }
    setECModalOpen(true);
  };

  const handleDelete = (id) => {
    setExtracurriculars((prev) => {
      let updatedExtracurriculars;

      console.log("ID: ");
      console.log(activityData.id);
      // ✅ FIX: Loop through `extracurriculars`, find matching `id`, and replace it
      updatedExtracurriculars = prev.filter((item) => item.id !== id);

      console.log("IS EDIITNG");

      console.log(
        "Updated extracurriculars before sending:",
        updatedExtracurriculars
      );

      // Send updated extracurriculars to backend
      const threadRequest = new Request(`users/${user.sub}/edit/`, {
        method: "POST",
        data: { extracurriculars: updatedExtracurriculars },
      });

      threadRequest
        .then(() => {
          toast.success("Successfully Updated Extracurriculars.");
          setChange(!change);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to Update Extracurriculars");
        });

      return updatedExtracurriculars;
    });
  };

  const handleResumeUpload = (data) => {
    console.log("Extracted Data:", data);
    // Use this data to auto-fill profile fields (setState functions would go here)
  };

  const recommendedColleges = [
    { name: "Harvard University", location: "Cambridge, MA" },
    { name: "Stanford University", location: "Stanford, CA" },
    { name: "MIT", location: "Cambridge, MA" },
  ];

  const recommendedProfiles = [
    { name: "Sarah Johnson", major: "Computer Science" },
    { name: "Michael Lee", major: "Business Administration" },
    { name: "Emily Davis", major: "Biology" },
  ];

  const recommendedEssays = [
    { title: "Overcoming Adversity - My College Journey" },
    { title: "Why I Chose Engineering" },
    { title: "The Power of Community in Education" },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        backgroundColor: "#F4FAFE",
        height: "100vh",
        minHeight: "100vh", // Changed from height: "100vh"
        padding: "20px 20px 300px 20px", // Add padding at the bottom
        overflowY: "auto",
      }}
    >
      {/* Profile Container */}
      <main
        style={{
          flex: 2,
          marginRight: "20px",
          maxWidth: "50%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          paddingBottom: "300px",
          height: "1400px", // Set a very tall explicit height
        }}
      >
        {/* Basic Information Section */}
        <section>
          {/* Banner Image (Full-width, No Margins) */}
          <div className="banner-container">
            <img
              src="blueflower.png"
              alt="Profile Banner"
              className="profile-banner"
            />
          </div>

          {/* Profile Header (Overlapping Profile Image) */}
          <div className="profile-header">
            <div className="profile-info">
              <h1>{user.name}</h1>
              <p>{user.email}</p>
            </div>
          </div>
        </section>

        {/* Demographics Section */}
        <section className="profile-section">
          <div className="section-header">
            <h2>
              <img
                src="resume.svg"
                alt="demographics"
                className="w-10 h-10 inline-block mr-2"
              />
              Demographics
            </h2>
            <button
              className="btn edit-btn"
              onClick={() => setIsProfileModalOpen(true)}
            >
              <i className="fas fa-edit"></i> Edit
            </button>
          </div>

          <div className="coursework-card">
            <div className="coursework-item">
              <strong>Gender: </strong>
              {gender !== "" ? <span>{gender}</span> : "N/A"}
            </div>
            <div className="coursework-item">
              <strong>Race:</strong> {race !== "" ? <span>{race}</span> : "N/A"}
            </div>
            <div className="coursework-item">
              <strong>Intended Major: </strong>
              {Array.isArray(intendedMajor) && intendedMajor.length > 0
                ? intendedMajor.join(", ") // Joins multiple majors into a comma-separated string
                : intendedMajor || "Undeclared"}
            </div>
          </div>
        </section>

        {/* Coursework Section */}
        <section className="profile-section coursework-section">
          <div className="coursework-header">
            <h2 className="section-title">
              <img
                src="exam.svg"
                alt="exam"
                className="w-10 h-10 inline-block mr-2"
              />
              Academics
            </h2>
            <button
              className="btn edit-btn"
              onClick={() => setIsGpaModalOpen(true)}
            >
              <i className="fas fa-edit"></i> <b>Edit</b>
            </button>
          </div>

          {isGpaModalOpen && (
            <GpaModal
              setUnweightedGpa={setUnweightedGpa}
              onClose={() => setIsGpaModalOpen(false)}
              sat={satScore}
              act={actScore}
              unweightedGpa={unweightedGpa}
              change={change}
              setChange={setChange}
            />
          )}

          <div className="coursework-card">
            <div className="coursework-item">
              <strong>SAT:</strong>{" "}
              {satScore !== 0 ? <span>{satScore}</span> : "N/A"}
            </div>
            <div className="coursework-item">
              <strong>ACT:</strong>{" "}
              {actScore !== 0 ? <span>{actScore}</span> : "N/A"}
            </div>
            <div className="coursework-item">
              <strong>Unweighted GPA:</strong> {unweightedGpa}{" "}
              <span className="scale">(Scale: 0-4)</span>
            </div>
          </div>
        </section>

        {/* Extracurricular Activities Section */}
        <section className="profile-section extracurricular-section">
          <div className="section-header">
            <h2>
              <img
                src="activities.svg"
                alt="extracurriculars"
                className="w-10 h-10 inline-block mr-2"
              />
              Extracurriculars
            </h2>
            <button className="btn add-btn" onClick={() => openModal()}>
              <i className="fas fa-plus-circle"></i> Add
            </button>
          </div>
          <div className="extracurriculars-list">
            {extracurriculars.length > 0 ? (
              extracurriculars.map((activity) => (
                <div className="extracurricular-card" key={activity.id}>
                  <div className="extracurricular-info">
                    <h3>{activity.name}</h3>
                    <p className="category">{activity.description}</p>
                  </div>
                  <div className="extracurricular-actions">
                    <button
                      className="edit-btn"
                      onClick={() => openModal(activity)}
                    >
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button
                      className="ec-btn delete-btn"
                      onClick={() => handleDelete(activity.id)}
                    >
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="interests-display">
                <p className="no-interests-text">
                  You haven’t added any extracurricular activities yet. Click
                  "Add" to get started!
                </p>
              </div>
            )}
          </div>

          {/* Modal Component */}
          <ExtracurricularModal
            isOpen={ECModalOpen}
            onClose={closeModal}
            activityData={activityData}
            setActivityData={setActivityData}
            extracurriculars={extracurriculars}
            setExtracurriculars={setExtracurriculars}
            change={change}
            setChange={setChange}
          />
        </section>

        {/* Awards Section */}
        <section className="profile-section extracurricular-section">
          <div className="section-header">
            <h2>
              <img
                src="trophy.svg"
                alt="trophy"
                className="w-10 h-10 inline-block mr-2"
              />{" "}
              Awards
            </h2>
            <button className="btn add-btn" onClick={() => openAwardsModal()}>
              <i className="fas fa-plus-circle"></i> Add
            </button>
          </div>
          <div className="extracurriculars-list">
            {awards.length > 0 ? (
              awards.map((award) => (
                <div className="extracurricular-card" key={award.id}>
                  <div className="extracurricular-info">
                    <p className="extracurricular-text">{award.title}</p>
                  </div>
                  <div className="extracurricular-actions">
                    <button
                      className="edit-btn"
                      onClick={() => openAwardsModal(award)}
                    >
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button
                      className="ec-btn delete-btn"
                      onClick={() => handleDeleteAward(award.id)}
                    >
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="interests-display">
                <p className="no-interests-text">
                  You haven’t added any awards yet. Click "Add" to get started!
                </p>
              </div>
            )}
          </div>
        </section>

        <AwardsModal
          isOpen={isAwardsModalOpen}
          onClose={() => setIsAwardsModalOpen(false)}
          awardData={awardData}
          setAwardData={setAwardData}
          awards={awards}
          setAwards={setAwards}
          change={change}
          setChange={setChange}
        />

        {/* Preferences Section */}
        <section className="profile-section">
          <div className="interests-header">
            <h2>
              <img
                src="interests.svg"
                alt="interests"
                className="w-10 h-10 inline-block mr-2"
              />{" "}
              Interests
            </h2>
            <button className="btn edit-btn" onClick={handleInterestModalOpen}>
              <i className="fas fa-edit"></i> <b>Edit</b>
            </button>
          </div>

          <div className="interests-display">
            {selectedInterests.length > 0 ? (
              selectedInterests.map((interest, index) => (
                <span key={index} className="interest-tag">
                  {interest}
                </span>
              ))
            ) : (
              <p className="no-interests-text">
                You haven’t added any interests yet. Click "Edit" to add!
              </p>
            )}
          </div>
        </section>

        {/* Interests Modal */}
        {isInterestModalOpen && (
          <InterestsModal
            selectedInterests={selectedInterests}
            onClose={handleModalClose}
            onSave={handleSaveInterests}
            change={change}
            setChange={setChange}
          />
        )}

        <div
          style={{ height: "300px", width: "100%", background: "transparent" }}
        ></div>
      </main>

      {/* Right Side (Recommended Colleges, Profiles, Essays) */}

      {/* Resume Upload Button 
  <button
    style={{
      width: "100%",
      padding: "10px",
      backgroundColor: "#0073b1",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginBottom: "20px", // Adds space between button and recommendations
      fontSize: "16px",
      fontWeight: "bold",
    }}
    onClick={() => setResumeModalOpen(true)}
  >
    📄 Upload Resume
  </button>*/}

      <aside
        style={{
          flex: 0.3,
          margin: "0 30px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          alignItems: "center",
          justifyContent: "start",
          background: "#F4FAFE", // Subtle gradient

          borderRadius: "12px",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Welcome Box */}
        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)",
            textAlign: "center",
            width: "100%",
            maxWidth: "400px",
          }}
        >
          <h2
            style={{
              fontSize: "22px",
              marginBottom: "8px",
              color: "#333",
              fontWeight: "600",
            }}
          >
            Welcome to Terra Find!
          </h2>
          <p style={{ fontSize: "14px", color: "#555", lineHeight: "1.6" }}>
            Find past applicants, essays, and resources based on you.
            Complete your profile to unlock personalized
            recommendations.
          </p>
          <h3
            style={{
              marginTop: "15px",
              marginBottom: "10px",
              fontSize: "16px",
              color: "black",
              textAlign: "left",
            }}
          >
            Profile Completion
          </h3>
          <ul
            style={{
              paddingLeft: "0px",
              fontSize: "14px",
              color: "#333",
              lineHeight: "1.8",
              textAlign: "left",
            }}
          >
            <li style={{ color: gender ? "#34D399" : "#EF4444" }}>
              {gender ? "✔️" : "❌"} Fill in Demographics
            </li>
            <li style={{ color: unweightedGpa ? "#34D399" : "#EF4444" }}>
              {unweightedGpa ? "✔️" : "❌"} Fill in Academics
            </li>
            <li
              style={{
                color: extracurriculars.length >= 3 ? "#34D399" : "#EF4444",
              }}
            >
              {extracurriculars.length >= 3 ? "✔️" : "❌"} Include at least 3
              Extracurriculars
            </li>
          </ul>

          {/* Progress Bar */}
          <div
            style={{
              marginTop: "15px",
              background: "#EAEAEA",
              borderRadius: "6px",
              height: "8px",
              width: "100%",
              position: "relative",
            }}
          >
            <div
              style={{
                width: `${
                  ((gender ? 1 : 0) +
                    (unweightedGpa ? 1 : 0) +
                    (extracurriculars.length >= 3 ? 1 : 0)) *
                  33
                }%`,
                background: "#0073b1",
                height: "100%",
                borderRadius: "6px",
                transition: "width 0.3s ease",
              }}
            ></div>
          </div>

          <p style={{ fontSize: "12px", marginTop: "6px", color: "#888" }}>
            {gender &&
            (unweightedGpa || satScore || actScore) &&
            extracurriculars.length >= 3
              ? "Profile Complete! Start Exploring."
              : "Complete your profile to access full features."}
          </p>

          {/* Checklist */}
        </div>

        {/* Feature Cards */}
        {[
          {
            title: "Matched Applicants",
            route: "profilematcher",
            description:
              "Find past applicants like you and see their admissions results.",
            image: "matcher.svg",
          },
          {
            title: "Matched Essays",
            route: "essaymatcher",
            description:
              "Discover essays from students with similar backgrounds.",
            image: "paper.svg",
          },
          {
            title: "College Databse",
            route: "collegedatabase",
            description:
              "See which colleges are the best fit based on past applications.",
            image: "school.svg",
          },
        ].map((section, index) => {
          const isProfileComplete =
            gender &&
            (unweightedGpa || satScore || actScore) &&
            extracurriculars.length >= 3;

          return (
            <div
              key={index}
              style={{
                width: "100%",
                maxWidth: "400px",
                background: "white",
                borderRadius: "12px",
                padding: "18px",
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)",
                border: "1px solid #E5E7EB",
                cursor: isProfileComplete ? "pointer" : "not-allowed",
                opacity: isProfileComplete ? 1 : 0.6,
                transition: "all 0.3s ease-in-out",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
                fontFamily: "'Inter', sans-serif",
              }}
              onClick={() => {
                if (isProfileComplete) {
                  //         if (section.route==="profilematcher"){
                  //         setShowResults(true);
                  //       }
                  setSelectedMode(section.route);
                  //      navigate(section.route);
                } else {
                  alert(
                    "❌ Please complete your profile to access this feature."
                  );
                }
              }}
            >
              {/* Hover Background Effect */}
              <div
                style={{
                  position: "absolute",
                  inset: "0",
                  background: "#EFF6FF",
                  opacity: "0",
                  transition: "opacity 0.3s ease",
                }}
                className="hover-bg"
              ></div>

              {/* Emoji Icon */}
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  background: "#E0F2FE",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                }}
              >
                <img
                  src={section.image}
                  alt="interests"
                  style={{
                    width: "80%", // Adjusts size dynamically
                    height: "80%",
                    objectFit: "contain", // Ensures full image is visible inside the div
                    display: "block", // Prevents extra spacing below image
                  }}
                />
              </div>

              {/* Text */}
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#333",
                    marginBottom: "4px",
                  }}
                >
                  {section.title}
                </h3>
                <p style={{ fontSize: "14px", color: "#555" }}>
                  {section.description}
                </p>
              </div>

              {/* Arrow */}
              <div style={{ fontSize: "22px", color: "#0073b1" }}>→</div>
            </div>
          );
        })}
      </aside>

      {isProfileModalOpen && (
        <ProfileModal
          onSave={() => setIsProfileModalOpen(false)}
          gender={gender}
          race={race}
          intendedMajor={intendedMajor}
          setChange={setChange}
          change={change}
        />
      )}
    </div>
  );
};

export default SuperPal;
