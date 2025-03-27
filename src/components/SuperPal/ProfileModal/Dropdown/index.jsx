import React from "react";
import "./dropdown.css"; // Ensure this contains dropdown styles

const Dropdown = ({ options, searchQuery, onSelect, exclude = [], visible }) => {
  // Filter options based on the search query and exclude selected items
  const filteredOptions = options.filter(
    (option) =>
      option.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !exclude.includes(option)
  );

  if (!visible) {
    return null; // Do not render the dropdown if it's not visible
  }

  return (
    <div className="dropdown-modal">
      {filteredOptions.length > 0 ? (
        filteredOptions.map((option) => (
          <div
            key={option}
            className="dropdown-item"
            onClick={() => onSelect(option)}
          >
            {option}
          </div>
        ))
      ) : (
        <div className="dropdown-item disabled">No options available</div>
      )}
    </div>
  );
};

export default Dropdown;
