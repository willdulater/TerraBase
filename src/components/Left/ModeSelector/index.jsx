import { useState } from "react";
import "./style.css"; // Make sure to apply dark mode styles

const ModeSelector = ({ selectedMode, setSelectedMode }) => {
  const handleSelectedMode = (mode) => {
    setSelectedMode(mode);
  };

  return (
    <div className="flex flex-col w-64 h-screen  px-3 py-5">
      {/* Logo Section */}
      <div className="flex items-center gap-2 px-3 pb-5">
        <img
          src="TerraFind.png"
          alt="Logo"
          className="h-8 cursor-pointer"
          onClick={() => handleSelectedMode("profile")}
        />
        
      </div>



      



      <SidebarItem
        icon="magniglass.svg"
        label="Search"
        isSelected={selectedMode === "imagematcher"}
        onClick={() => handleSelectedMode("imagematcher")}
      />

{/* Search & Home Section */}
<div className="flex flex-col gap-1">
        <SidebarItem
          icon="tulip.svg"
          label="Growth Analysis"
          isSelected={selectedMode === "imageupload"}
          onClick={() => handleSelectedMode("imageupload")}
        />
        
      </div>
<SidebarItem
        icon="leaf.svg"
        label="Database"
        isSelected={selectedMode === "test"}
        onClick={() => handleSelectedMode("test")}
      />
      
{/*

<div className="border-t border-gray-600 my-3"></div>

      <h3 className="text-xs font-medium text-gray-500 px-3 py-1 uppercase">Colleges</h3>
      */}

      {/* Settings & Other Options 
      <SidebarItem
        icon="university.svg"
        label="All Colleges"
        isSelected={selectedMode === "collegedatabase"}
        onClick={() => handleSelectedMode("collegedatabase")}
      />
      <SidebarItem
        icon="graduation.svg"
        label="My Colleges"
        isSelected={selectedMode === "yourcolleges"}
        onClick={() => handleSelectedMode("yourcolleges")}
      />*/}
      
      {/* Divider 
      <div className="border-t border-gray-600 my-3"></div>

      <h3 className="text-xs font-medium text-gray-500 px-3 py-1 uppercase">Search</h3>
*/}
      {/* Settings & Other Options 
      <SidebarItem
        icon="checklist.svg"
        label="EC Database"
        isSelected={selectedMode === "ecs"}
        onClick={() => handleSelectedMode("ecs")}
      />
      <SidebarItem
        icon="medal.svg"
        label="Awards Database"
        isSelected={selectedMode === "awards"}
        onClick={() => handleSelectedMode("awards")}
      />

      */}
{/*
<div className="border-t border-gray-600 my-3"></div>

<h3 className="text-xs font-medium text-gray-500 px-3 py-1 uppercase">Resources</h3>


<SidebarItem
  icon="settings-icon.svg"
  label="AI Tools"
  isSelected={selectedMode === "ai"}
  onClick={() => handleSelectedMode("ai")}
/>
<SidebarItem
  icon="template-icon.svg"
  label="Chance Calculator"
  isSelected={selectedMode === "chance"}
  onClick={() => handleSelectedMode("chance")}
/>
*/}
      
    </div>
  );
};

// Sidebar Item Component for Reusability
const SidebarItem = ({ icon, label, isSelected, onClick }) => {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer transition ${
        isSelected ? "bg-[#1E5631] text-white" : "hover:bg-[#ECECEC]"
      }`}
      onClick={onClick}
    >
      <img
        src={icon}
        alt={label}
        className="w-5 h-5"
        style={isSelected ? { filter: "invert(1)" } : {}}
      />
      <p className="text-sm">{label}</p>
    </div>
  );
};


export default ModeSelector;
