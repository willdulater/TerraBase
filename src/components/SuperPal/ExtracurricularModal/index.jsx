import React from "react";
import "./ec.css"; // Optional for styling
import Request from "../../Request/index.jsx";
import { useAuth0 } from "@auth0/auth0-react";
import toast from "react-hot-toast";

const ExtracurricularModal = ({ 
  isOpen, 
  onClose, 
  
  activityData, 
  setActivityData,
  extracurriculars,
  setExtracurriculars,
  change,
  setChange,
}) => {

  const { user } = useAuth0();
  if (!isOpen) return null; // Do not render if modal is closed

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Character limits
    const limits = {
      name: 50,
      description: 150,
    };

    // Truncate if exceeding limit
    if (value.length > limits[name]) {
      toast.error(`Exceeded ${limits[name]} character limit.`);
      return;
    }

    setActivityData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSave = () => {
    if (!activityData.name || !activityData.description) {
      toast.error("Please fill out all fields.");
      return;
    }

    if (extracurriculars.length >= 10 && !activityData.isEditing) {
      toast.error("You can only add up to 10 extracurriculars.");
      return;
    }

    onClose(); // ✅ Close modal after saving

    setExtracurriculars((prev) => {
      let updatedExtracurriculars;

      if (activityData.isEditing) {
        console.log("ID: ");
        console.log(activityData.id);
        // ✅ FIX: Loop through `extracurriculars`, find matching `id`, and replace it
        updatedExtracurriculars = prev.map((item) =>
          item.id === activityData.id ? activityData : item
        );

        console.log("IS EDIITNG");
      } else {
        // ✅ Add new extracurricular with a unique ID
        updatedExtracurriculars = [
          ...prev,
          {
            id: crypto.randomUUID(),
            name: activityData.name,
            description: activityData.description,
          },
        ];

        console.log("IS NOT EDITING");
      }

      console.log("Updated extracurriculars before sending:", updatedExtracurriculars);

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

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h3>{activityData.isEditing ? "Edit Activity" : "Add Activity"}</h3>
        <form>
          <div className="form-group">
            <label htmlFor="activityName">Activity Name</label>
            <input
              type="text"
              id="activityName"
              name="name"
              value={activityData.name || ""}
              onChange={handleInputChange}
              maxLength={50}
              required
            />
            <p className={`text-xs ${activityData.name?.length > 50 ? "text-red-500" : "text-gray-500"}`}>
              {activityData.name?.length || 0}/50 characters
            </p>
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              name="description"
              value={activityData.description || ""}
              onChange={handleInputChange}
              maxLength={150} // Prevents typing beyond 150 characters
              rows="3"
              required
            />
            <p className={`text-xs ${activityData.description?.length > 150 ? "text-red-500" : "text-gray-500"}`}>
              {activityData.description?.length || 0}/150 characters
            </p>
          </div>
        </form>
        <div className="modal-actions">
          <button className="save-btn" onClick={handleSave}>Save</button>
          
        </div>
      </div>
    </div>
  );
};

export default ExtracurricularModal;
