import React, { useState } from "react";
import "./interests.css"; // Include CSS for styling
import { useAuth0 } from "@auth0/auth0-react";
import toast from "react-hot-toast";
import Request from "../../Request/index.jsx";


const categories = {
  Academics: [
    "Research",
    "Olympiad",
    "Science Fair",
    "Debate",
    "Model UN (MUN)",
    "Academic Bowl",
    "Math Competition",
    "Spelling Bee",
    "SAT/ACT Tutoring",
    "Test Prep Club",
    "Honor Society",
    "Advanced Coursework (AP/IB/Dual Enrollment)",
  ],
  Extracurriculars: [
    "Cultural Club",
    "Language Club",
    "STEM Club",
    "Investment Club",
    "Art Club",
    "Dance Team",
    "Theater",
    "Music Band",
    "Robotics",
    "Coding/Programming",
    "Gaming Club",
  ],
  "Creative Arts": [
    "Art",
    "Graphic Design",
    "Photography",
    "Music Performance",
    "Drama/Theater",
    "Film",
    "Creative Writing",
    "Poetry",
    "Fashion Design",
    "Animation",
  ],
  STEM: [
    "Coding",
    "Robotics",
    "Science Olympiad",
    "Engineering",
    "Math Club",
    "Chemistry Club",
    "Technology Club",
    "App Development",
    "Hackathon",
    "AI/ML Projects",
  ],
  "Community Engagement": [
    "Volunteering",
    "Nonprofit",
    "Fundraising",
    "Advocacy",
    "Activism",
    "Environmental Club",
    "Community Service",
    "Outreach Programs",
    "Food Bank Volunteer",
    "Disaster Relief",
  ],
  "Sports & Fitness": [
    "Varsity Sports",
    "Junior Varsity",
    "Tennis",
    "Soccer",
    "Basketball",
    "Swimming",
    "Track & Field",
    "Martial Arts",
    "Esports",
    "Recreational Sports",
  ],
  Competitions: [
    "Academic Competition",
    "Math Olympiad",
    "Science Olympiad",
    "National Merit",
    "Quiz Bowl",
    "Debate Championship",
    "Robotics Competition",
    "Gaming Tournament",
  ],
  "Writing & Publications": [
    "Journalism",
    "School Newspaper",
    "Blog Writing",
    "Published Research",
    "Editorial",
    "Creative Writing",
    "Essay Contest",
  ],
  Miscellaneous: [
    "Entrepreneurship",
    "Personal Projects",
    "Caregiver",
    "Social Media Manager",
    "Public Speaking",
    "Leadership Program",
    "School Ambassador",
    "Sustainability Projects",
  ],
};

const InterestsModal = ({ onClose, onSave, selectedInterests, change, setChange}) => {
  const [selectedOptions, setSelectedOptions] = useState(selectedInterests);

  const { user } = useAuth0();

  const toggleOption = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleSave = () => {
    console.log("Selected Interests:", selectedOptions); // Debug

    const threadRequest = new Request("users/" + user.sub + "/edit/", {
      method: "POST",
      data: {
        interests: selectedOptions,
      },
    });

    threadRequest
      .then((res) => {
        toast.success("Successfully Updated Interests.");
        setChange(!change);
        onClose(); // Close modal on success
      })
      .catch((err) => {
        console.error("Error saving interests:", err);
        toast.error("Failed to Update Interests.");
      });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <b>Edit Interests</b>
          <button className="close-btn" onClick={onClose}>
           ×
          </button>
        </div>
        <div className="modal-body">
          
          {Object.entries(categories).map(([category, options]) => (
            <div key={category} className="category-section">
              <h3>{category}</h3>
              <div className="options">
                {options.map((option) => (
                  <button
                    key={option}
                    className={`option-btn ${
                      selectedOptions.includes(option) ? "selected" : ""
                    }`}
                    onClick={() => toggleOption(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterestsModal;
