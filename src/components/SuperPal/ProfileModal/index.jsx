import React, { useState } from "react";
import "./profile.css"; // Custom CSS for styling
import Dropdown from "./Dropdown";
import Request from "../../Request/index.jsx";
import { useAuth0 } from "@auth0/auth0-react";
import toast from "react-hot-toast";

const ProfileModal = ({ 
  onSave,
  gender,
  race,
  intendedMajor,
  setChange,
  change,
}) => {
  const { user } = useAuth0();

  const [formData, setFormData] = useState({
    gender: gender,
    race: race,
    intendedMajors: intendedMajor ? intendedMajor.split(",").map((m) => m.trim()) : [], // Split and trim majors
  });

  const [majorSearch, setMajorSearch] = useState(""); // For tracking input in the search bar
  const [isMajorDropdownVisible, setIsMajorDropdownVisible] = useState(false);

  const majors = [
    "African American Studies",
    "African Studies",
    "American Studies",
    "Anthropology",
    "Applied Mathematics",
    "Applied Physics",
    "Archaeological Studies",
    "Architecture",
    "Art",
    "Astronomy",
    "Astrophysics",
    "Biomedical Engineering",
    "Chemical Engineering",
    "Chemistry",
    "Classical Civilization",
    "Classics",
    "Cognitive Science",
    "Comparative Literature",
    "Computer Science",
    "Computer Science and Economics",
    "Computer Science and Mathematics",
    "Computer Science and Psychology",
    "Computing and Linguistics",
    "Computing and the Arts",
    "Earth and Planetary Sciences",
    "East Asian Languages and Literatures",
    "East Asian Studies",
    "Ecology and Evolutionary Biology",
    "Economics",
    "Economics and Mathematics",
    "Electrical Engineering",
    "Electrical Engineering and Computer Science",
    "Engineering Sciences (Chemical)",
    "Engineering Sciences (Electrical)",
    "Engineering Sciences (Environmental)",
    "Engineering Sciences (Mechanical)",
    "English",
    "Environmental Engineering",
    "Environmental Studies",
    "Ethics, Politics, and Economics",
    "Ethnicity, Race, and Migration",
    "Film and Media Studies",
    "French",
    "German Studies",
    "Global Affairs",
    "Greek, Ancient and Modern",
    "History",
    "History of Art",
    "History of Science, Medicine, and Public Health",
    "Humanities",
    "Italian Studies",
    "Jewish Studies",
    "Latin American Studies",
    "Linguistics",
    "Mathematics",
    "Mathematics and Philosophy",
    "Mathematics and Physics",
    "Mechanical Engineering",
    "Modern Middle East Studies",
    "Molecular Biophysics and Biochemistry",
    "Molecular, Cellular, and Developmental Biology",
    "Music",
    "Near Eastern Languages and Civilizations",
    "Neuroscience",
    "Philosophy",
    "Physics",
    "Physics and Geosciences",
    "Physics and Philosophy",
    "Political Science",
    "Portuguese",
    "Psychology",
    "Religious Studies",
    "Russian",
    "Russian, East European, and Eurasian Studies",
    "Sociology",
    "South Asian Studies",
    "Spanish",
    "Special Divisional Major",
    "Statistics and Data Science",
    "Theater and Performance Studies",
    "Urban Studies",
    "Women’s, Gender, and Sexuality Studies",
    "Other"
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMajorSearch = (e) => {
    const value = e.target.value;
    setMajorSearch(value);
    setIsMajorDropdownVisible(value.length > 0); // Show dropdown only when there is input
  };

  const handleMajorSelect = (major) => {
    if (!formData.intendedMajors.includes(major)) {
      setFormData((prevData) => ({
        ...prevData,
        intendedMajors: [...prevData.intendedMajors, major],
      }));
    }
    setMajorSearch(""); // Reset search bar
    setIsMajorDropdownVisible(false); // Close dropdown
  };

  const handleMajorRemove = (major) => {
    setFormData((prevData) => ({
      ...prevData,
      intendedMajors: prevData.intendedMajors.filter((m) => m !== major),
    }));
  };

  const handleSave = (e) => {

    if (!formData.race || !formData.gender || formData.intendedMajors.length === 0) {
      toast.error("Please fill out all fields.");
      return;
    }
    console.log(formData);
    e.preventDefault();
    const threadRequest = new Request("users/" + user.sub + "/edit/", {
      method: "POST",
      data: {
        race: formData.race || null, // Use values from formData dynamically
        gender: formData.gender || null,
        intended_major: formData.intendedMajors.join(", "), // Join array as a string
      },
    });
    threadRequest
      .then((res) => {
        toast.success("Successfully Updated Demographics.");
        setChange(!change);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to Update Demographics");
      });

      onSave();

      
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={() => onSave(null)}>
          ×
        </button>

        <h2 className="modal-title">Edit Demographics</h2>

        {/* Intended Major Section */}
        <div className="form-group">
          <label>Intended Majors</label>
          <div className="chip-input-container">
            <div className="chips">
              {formData.intendedMajors.map((major) => (
                <div key={major} className="chip">
                  {major}
                  <span
                    className="chip-remove"
                    onClick={() => handleMajorRemove(major)}
                  >
                    ×
                  </span>
                </div>
              ))}
            </div>
            <input
              type="text"
              placeholder="Search for a major"
              value={majorSearch}
              onChange={handleMajorSearch}
              onFocus={() => setIsMajorDropdownVisible(true)}
              onBlur={() =>
                setTimeout(() => setIsMajorDropdownVisible(false), 200)
              }
            />
            <Dropdown
              options={majors}
              searchQuery={majorSearch}
              exclude={formData.intendedMajors}
              visible={isMajorDropdownVisible}
              onSelect={handleMajorSelect}
            />
          </div>
        </div>

        {/* Gender Section */}
        <div className="form-group">
          <label className="section-label">👤 Gender</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={formData.gender === "Male"}
                onChange={handleChange}
              />
              <span className="custom-radio"></span>
              Male
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={formData.gender === "Female"}
                onChange={handleChange}
              />
              <span className="custom-radio"></span>
              Female
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="gender"
                value="Non-binary"
                checked={formData.gender === "Non-binary"}
                onChange={handleChange}
              />
              <span className="custom-radio"></span>
              Non-binary / third gender
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="gender"
                value="Prefer Not to Say"
                checked={formData.gender === "Prefer Not to Say"}
                onChange={handleChange}
              />
              <span className="custom-radio"></span>
              Prefer not to say
            </label>
          </div>
        </div>

        {/* Race Section */}
        <div className="form-group race-section">
          <label className="section-label">🌎 Race or Ethnicity</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="race"
                value="American Indian"
                checked={formData.race === "American Indian"}
                onChange={handleChange}
              />
              <span className="custom-radio"></span>
              American Indian or Alaska Native
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="race"
                value="Asian"
                checked={formData.race === "Asian"}
                onChange={handleChange}
              />
              <span className="custom-radio"></span>
              Asian
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="race"
                value="Black"
                checked={formData.race === "Black"}
                onChange={handleChange}
              />
              <span className="custom-radio"></span>
              Black or African American
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="race"
                value="Hispanic"
                checked={formData.race === "Hispanic"}
                onChange={handleChange}
              />
              <span className="custom-radio"></span>
              Hispanic or Latino
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="race"
                value="Pacific Islander"
                checked={formData.race === "Pacific Islander"}
                onChange={handleChange}
              />
              <span className="custom-radio"></span>
              Native Hawaiian or Other Pacific Islander
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="race"
                value="White"
                checked={formData.race === "White"}
                onChange={handleChange}
              />
              <span className="custom-radio"></span>
              White
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="race"
                value="Other"
                checked={formData.race === "Other"}
                onChange={handleChange}
              />
              <span className="custom-radio"></span>
              Other ethnicity, biracial, or multiracial
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="race"
                value="Prefer Not to Say"
                checked={formData.race === "Prefer Not to Say"}
                onChange={handleChange}
              />
              <span className="custom-radio"></span>
              Prefer not to say
            </label>
          </div>
        </div>

        {/* Save Button */}
        <button className="save-btn" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default ProfileModal;
