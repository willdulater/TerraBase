import React from "react";
import "./awards.css"; // Optional for styling
import Request from "../../Request/index.jsx";
import { useAuth0 } from "@auth0/auth0-react";
import toast from "react-hot-toast";

const AwardsModal = ({ 
  isOpen, 
  onClose, 
  awardData, 
  setAwardData,
  awards,
  setAwards,
  change,
  setChange,
}) => {
  const { user } = useAuth0();

  if (!isOpen) return null; // Do not render if modal is closed

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Character limit (100 max)
    if (value.length > 100) {
      toast.error("Awards must be 100 characters or less.");
      return;
    }

    setAwardData((prev) => ({ ...prev, title: value }));
  };

  const handleSave = () => {
    if (!awardData.title) {
      toast.error("Please enter an award title.");
      return;
    }

    if (awards.length >= 5 && !awardData.isEditing) {
      toast.error("You can only add up to 5 awards.");
      return;
    }

    onClose(); // ✅ Close modal after saving

    setAwards((prev) => {
      let updatedAwards;

      if (awardData.isEditing) {
        updatedAwards = prev.map((item) =>
            item.id === awardData.id
        ? { id: awardData.id, title: awardData.title } // ✅ Remove `isEditing`
        : item
        );
      } else {
        updatedAwards = [
          ...prev,
          {
            id: crypto.randomUUID(),
            title: awardData.title,
          },
        ];
      }

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

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h3>{awardData.isEditing ? "Edit Award" : "Add Award"}</h3>
        <form>
          <div className="form-group">
            <label htmlFor="awardTitle">Award Title</label>
            <input
              type="text"
              id="awardTitle"
              name="title"
              value={awardData.title || ""}
              onChange={handleInputChange}
              maxLength={100}
              required
              placeholder="Enter award title (max 100 characters)"
            />
            <p className={`text-xs ${awardData.title?.length > 100 ? "text-red-500" : "text-gray-500"}`}>
              {awardData.title?.length || 0}/100 characters
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

export default AwardsModal;
