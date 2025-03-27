import React, { useState, useEffect } from "react";
import Awards from "../Awards";
import Academics from "./Academics";
import Extracurriculars from "../Extracurriculars";
import Decisions from "../Decisions";
import Overview from "../Overview";
import studentData from "../../studentData";

const ProfileDisplay = ({ matches, distances }) => {
  // State to track selected profile
  const [selectedId, setSelectedId] = useState(Number(matches[0]) || 1);
  // State to track saved/bookmarked profiles
  const [savedProfiles, setSavedProfiles] = useState([]);
  // State to track whether to show all profiles or only saved ones
  const [activeTab, setActiveTab] = useState("all"); // "all", "saved", or "filter"
  // State for filter panel visibility
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    gpa: { min: 0, max: 4.0, enabled: false },
    sat: { min: 400, max: 1600, enabled: false },
    act: { min: 1, max: 36, enabled: false },
    schoolType: { public: true, private: true, enabled: false },
    decisions: { accepted: true, rejected: true, waitlisted: true, enabled: false },
    similarityRating: { min: 1, max: 5, enabled: false }
  });

  // Load saved profiles from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('savedProfiles');
    if (saved) {
      setSavedProfiles(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever savedProfiles changes
  useEffect(() => {
    localStorage.setItem('savedProfiles', JSON.stringify(savedProfiles));
  }, [savedProfiles]);

  // Ensure `matches` is an array before using it
  if (!Array.isArray(matches)) {
    console.error("Error: `matches` is not an array", matches);
    return <p>Error loading matches.</p>;
  }

  // Convert percentage similarity to star rating (0-5 stars)
  // MOVED THIS FUNCTION EARLIER to fix the reference error
  const calculateStarRating = (similarityPercentage) => {
    if (!similarityPercentage) return 0;
    const percentage = parseFloat(similarityPercentage);
    return Math.round((percentage / 100) * 5);
  };

  // Apply filters to the matches
  const applyFilters = (profileList) => {
    if (activeTab !== "filter") return profileList;
    
    return profileList.filter(profileId => {
      const profile = studentData.find(s => s.id === Number(profileId));
      if (!profile) return false;
      
      // Calculate similarity rating for this profile
      const index = matches.findIndex(id => Number(id) === Number(profileId));
      const similarityPercentage = distances[index];
      const rating = calculateStarRating(similarityPercentage);
      
      // GPA Filter
      if (filters.gpa.enabled) {
        const profileGpa = profile.academics?.gpa;
        if (!profileGpa || profileGpa < filters.gpa.min || profileGpa > filters.gpa.max) {
          return false;
        }
      }
      
      // SAT Filter
      if (filters.sat.enabled) {
        const profileSat = profile.academics?.sat_total;
        if (!profileSat || profileSat < filters.sat.min || profileSat > filters.sat.max) {
          return false;
        }
      }
      
      // ACT Filter
      if (filters.act.enabled) {
        const profileAct = profile.academics?.act_composite;
        if (!profileAct || profileAct < filters.act.min || profileAct > filters.act.max) {
          return false;
        }
      }
      
      // School Type Filter
      if (filters.schoolType.enabled) {
        const isPublic = profile.demographics?.school_type === 'Public';
        const isPrivate = profile.demographics?.school_type === 'Private';
        
        if ((isPublic && !filters.schoolType.public) || 
            (isPrivate && !filters.schoolType.private)) {
          return false;
        }
      }
      
      // Decision Outcomes Filter
      if (filters.decisions.enabled && profile.decisions) {
        const hasAccepted = profile.decisions.some(d => d.status === 'Accepted');
        const hasRejected = profile.decisions.some(d => d.status === 'Rejected');
        const hasWaitlisted = profile.decisions.some(d => d.status === 'Waitlisted');
        
        const showAccepted = filters.decisions.accepted && hasAccepted;
        const showRejected = filters.decisions.rejected && hasRejected;
        const showWaitlisted = filters.decisions.waitlisted && hasWaitlisted;
        
        if (!(showAccepted || showRejected || showWaitlisted)) {
          return false;
        }
      }
      
      // Similarity Rating Filter
      if (filters.similarityRating.enabled) {
        if (rating < filters.similarityRating.min || rating > filters.similarityRating.max) {
          return false;
        }
      }
      
      return true;
    });
  };

  // Get the list of profiles to display based on active tab
  const getDisplayedProfiles = () => {
    if (activeTab === "saved") {
      return matches.filter(id => savedProfiles.includes(Number(id)));
    }
    
    const baseProfiles = activeTab === "all" ? matches : matches;
    return applyFilters(baseProfiles);
  };

  const displayedProfiles = getDisplayedProfiles();

  // Handle bookmarking/unbookmarking a profile
  const toggleSave = (id, e) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    const profileId = Number(id);
    
    if (savedProfiles.includes(profileId)) {
      // Remove from saved profiles
      setSavedProfiles(savedProfiles.filter(savedId => savedId !== profileId));
    } else {
      // Add to saved profiles
      setSavedProfiles([...savedProfiles, profileId]);
    }
  };

  // Generate star rating elements
  const renderStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`star-${i}`} className="text-yellow-400">
          ★
        </span>
      );
    }

    // Add empty stars
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-200">
          ★
        </span>
      );
    }

    return stars;
  };

  // Update a specific filter
  const updateFilter = (category, field, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  // Toggle a filter's enabled state
  const toggleFilterEnabled = (category) => {
    setFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        enabled: !prev[category].enabled
      }
    }));
  };

  // Reset all filters to default state
  const resetFilters = () => {
    setFilters({
      gpa: { min: 0, max: 4.0, enabled: false },
      sat: { min: 400, max: 1600, enabled: false },
      act: { min: 1, max: 36, enabled: false },
      schoolType: { public: true, private: true, enabled: false },
      decisions: { accepted: true, rejected: true, waitlisted: true, enabled: false },
      similarityRating: { min: 1, max: 5, enabled: false }
    });
  };

  // Filter panel component
  const FilterPanel = () => (
    <div className="p-3 border-b border-gray-200 bg-white">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-gray-700">Filter Profiles</h3>
        <button 
          onClick={resetFilters}
          className="text-xs text-blue-500 hover:text-blue-700"
        >
          Reset
        </button>
      </div>

      {/* GPA Filter */}
      <div className="mb-4">
        <div className="flex items-center mb-1">
          <input
            type="checkbox"
            id="filter-gpa"
            checked={filters.gpa.enabled}
            onChange={() => toggleFilterEnabled('gpa')}
            className="mr-2"
          />
          <label htmlFor="filter-gpa" className="text-xs font-medium text-gray-700">GPA</label>
        </div>
        <div className="flex items-center justify-between px-2">
          <input
            type="number"
            min="0"
            max="4.0"
            step="0.1"
            value={filters.gpa.min}
            onChange={(e) => updateFilter('gpa', 'min', parseFloat(e.target.value))}
            disabled={!filters.gpa.enabled}
            className="w-16 text-xs p-1 border rounded"
          />
          <span className="text-xs text-gray-500 mx-2">to</span>
          <input
            type="number"
            min="0"
            max="4.0"
            step="0.1"
            value={filters.gpa.max}
            onChange={(e) => updateFilter('gpa', 'max', parseFloat(e.target.value))}
            disabled={!filters.gpa.enabled}
            className="w-16 text-xs p-1 border rounded"
          />
        </div>
      </div>

      {/* SAT Filter */}
      <div className="mb-4">
        <div className="flex items-center mb-1">
          <input
            type="checkbox"
            id="filter-sat"
            checked={filters.sat.enabled}
            onChange={() => toggleFilterEnabled('sat')}
            className="mr-2"
          />
          <label htmlFor="filter-sat" className="text-xs font-medium text-gray-700">SAT Score</label>
        </div>
        <div className="flex items-center justify-between px-2">
          <input
            type="number"
            min="400"
            max="1600"
            step="10"
            value={filters.sat.min}
            onChange={(e) => updateFilter('sat', 'min', parseInt(e.target.value))}
            disabled={!filters.sat.enabled}
            className="w-16 text-xs p-1 border rounded"
          />
          <span className="text-xs text-gray-500 mx-2">to</span>
          <input
            type="number"
            min="400"
            max="1600"
            step="10"
            value={filters.sat.max}
            onChange={(e) => updateFilter('sat', 'max', parseInt(e.target.value))}
            disabled={!filters.sat.enabled}
            className="w-16 text-xs p-1 border rounded"
          />
        </div>
      </div>

      {/* ACT Filter */}
      <div className="mb-4">
        <div className="flex items-center mb-1">
          <input
            type="checkbox"
            id="filter-act"
            checked={filters.act.enabled}
            onChange={() => toggleFilterEnabled('act')}
            className="mr-2"
          />
          <label htmlFor="filter-act" className="text-xs font-medium text-gray-700">ACT Score</label>
        </div>
        <div className="flex items-center justify-between px-2">
          <input
            type="number"
            min="1"
            max="36"
            value={filters.act.min}
            onChange={(e) => updateFilter('act', 'min', parseInt(e.target.value))}
            disabled={!filters.act.enabled}
            className="w-16 text-xs p-1 border rounded"
          />
          <span className="text-xs text-gray-500 mx-2">to</span>
          <input
            type="number"
            min="1"
            max="36"
            value={filters.act.max}
            onChange={(e) => updateFilter('act', 'max', parseInt(e.target.value))}
            disabled={!filters.act.enabled}
            className="w-16 text-xs p-1 border rounded"
          />
        </div>
      </div>

      {/* School Type Filter */}
      <div className="mb-4">
        <div className="flex items-center mb-1">
          <input
            type="checkbox"
            id="filter-school-type"
            checked={filters.schoolType.enabled}
            onChange={() => toggleFilterEnabled('schoolType')}
            className="mr-2"
          />
          <label htmlFor="filter-school-type" className="text-xs font-medium text-gray-700">School Type</label>
        </div>
        <div className="flex items-center px-2">
          <input
            type="checkbox"
            id="school-type-public"
            checked={filters.schoolType.public}
            onChange={(e) => updateFilter('schoolType', 'public', e.target.checked)}
            disabled={!filters.schoolType.enabled}
            className="mr-1"
          />
          <label htmlFor="school-type-public" className="text-xs text-gray-700 mr-3">Public</label>
          
          <input
            type="checkbox"
            id="school-type-private"
            checked={filters.schoolType.private}
            onChange={(e) => updateFilter('schoolType', 'private', e.target.checked)}
            disabled={!filters.schoolType.enabled}
            className="mr-1"
          />
          <label htmlFor="school-type-private" className="text-xs text-gray-700">Private</label>
        </div>
      </div>

      {/* Decision Outcomes Filter */}
      <div className="mb-4">
        <div className="flex items-center mb-1">
          <input
            type="checkbox"
            id="filter-decisions"
            checked={filters.decisions.enabled}
            onChange={() => toggleFilterEnabled('decisions')}
            className="mr-2"
          />
          <label htmlFor="filter-decisions" className="text-xs font-medium text-gray-700">Decision Outcomes</label>
        </div>
        <div className="flex flex-wrap items-center px-2">
          <div className="mr-3">
            <input
              type="checkbox"
              id="decisions-accepted"
              checked={filters.decisions.accepted}
              onChange={(e) => updateFilter('decisions', 'accepted', e.target.checked)}
              disabled={!filters.decisions.enabled}
              className="mr-1"
            />
            <label htmlFor="decisions-accepted" className="text-xs text-gray-700">Accepted</label>
          </div>
          
          <div className="mr-3">
            <input
              type="checkbox"
              id="decisions-rejected"
              checked={filters.decisions.rejected}
              onChange={(e) => updateFilter('decisions', 'rejected', e.target.checked)}
              disabled={!filters.decisions.enabled}
              className="mr-1"
            />
            <label htmlFor="decisions-rejected" className="text-xs text-gray-700">Rejected</label>
          </div>
          
          <div>
            <input
              type="checkbox"
              id="decisions-waitlisted"
              checked={filters.decisions.waitlisted}
              onChange={(e) => updateFilter('decisions', 'waitlisted', e.target.checked)}
              disabled={!filters.decisions.enabled}
              className="mr-1"
            />
            <label htmlFor="decisions-waitlisted" className="text-xs text-gray-700">Waitlisted</label>
          </div>
        </div>
      </div>

      {/* Similarity Rating Filter */}
      <div className="mb-2">
        <div className="flex items-center mb-1">
          <input
            type="checkbox"
            id="filter-similarity"
            checked={filters.similarityRating.enabled}
            onChange={() => toggleFilterEnabled('similarityRating')}
            className="mr-2"
          />
          <label htmlFor="filter-similarity" className="text-xs font-medium text-gray-700">Similarity Rating</label>
        </div>
        <div className="flex items-center justify-between px-2">
          <input
            type="number"
            min="1"
            max="5"
            value={filters.similarityRating.min}
            onChange={(e) => updateFilter('similarityRating', 'min', parseInt(e.target.value))}
            disabled={!filters.similarityRating.enabled}
            className="w-16 text-xs p-1 border rounded"
          />
          <span className="text-xs text-gray-500 mx-2">to</span>
          <input
            type="number"
            min="1"
            max="5"
            value={filters.similarityRating.max}
            onChange={(e) => updateFilter('similarityRating', 'max', parseInt(e.target.value))}
            disabled={!filters.similarityRating.enabled}
            className="w-16 text-xs p-1 border rounded"
          />
        </div>
      </div>
      
      <div className="mt-4">
        <button 
          onClick={() => setShowFilterPanel(false)}
          className="w-full py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );

  // Filter student by studentData find
  const student = studentData.find((student) => student.id === selectedId);

  return (
    <div className="flex h-full bg-white">
      {/* Sidebar with filter options and profiles */}
      <div className="w-52 h-full bg-gray-50 border-r border-gray-200 overflow-hidden flex flex-col">
        <div className="p-3 border-b border-gray-200">
          <h2 className="text-sm font-medium text-gray-700 mb-2">
            Matched Profiles
          </h2>
          
          {/* Navigation tabs */}
          <div className="flex text-xs mb-2 bg-gray-200 rounded-md overflow-hidden">
            <button 
              className={`flex-1 py-1 ${activeTab === "all" ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
              onClick={() => {
                setActiveTab("all");
                setShowFilterPanel(false);
              }}
            >
              All
            </button>
            <button 
              className={`flex-1 py-1 ${activeTab === "saved" ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
              onClick={() => {
                setActiveTab("saved");
                setShowFilterPanel(false);
              }}
            >
              Saved
            </button>
            <button 
              className={`flex-1 py-1 ${activeTab === "filter" ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
              onClick={() => {
                setActiveTab("filter");
                setShowFilterPanel(true);
              }}
            >
              Filter
            </button>
          </div>
          
          {/* Filter indicator */}
          {activeTab === "filter" && !showFilterPanel && (
            <button 
              onClick={() => setShowFilterPanel(true)}
              className="flex items-center justify-between w-full text-xs bg-blue-50 text-blue-700 p-2 rounded-md mb-2"
            >
              <span>Edit Filters</span>
              <span>🔍</span>
            </button>
          )}
        </div>

        {/* Filter panel */}
        {showFilterPanel && <FilterPanel />}

        {/* Profiles list */}
        <div className={`overflow-y-auto flex-1 ${showFilterPanel ? 'hidden' : 'block'}`}>
          {displayedProfiles.length > 0 ? (
            displayedProfiles.map((studentId, index) => {
              const originalIndex = matches.findIndex(id => id === studentId);
              const rating = calculateStarRating(distances[originalIndex]);
              const isSaved = savedProfiles.includes(Number(studentId));
              
              return (
                <div
                  key={studentId}
                  className={`p-2 border-b border-gray-100 cursor-pointer transition-colors ${
                    Number(studentId) === selectedId 
                      ? "bg-blue-50 border-l-2 border-l-blue-500" 
                      : "hover:bg-gray-50 border-l-2 border-l-transparent"
                  }`}
                  onClick={() => setSelectedId(Number(studentId))}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="px-2 py-0.5 bg-gray-200 rounded-full text-xs text-gray-700">
                      #{originalIndex + 1}
                    </div>
                    <button 
                      onClick={(e) => toggleSave(studentId, e)}
                      className="text-lg focus:outline-none"
                      title={isSaved ? "Remove from saved" : "Save profile"}
                    >
                      {isSaved ? "🔖" : "☆"}
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div>{renderStarRating(rating)}</div>
                    <span className="text-gray-500 text-xs">{rating}/5</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center text-gray-500 text-xs">
              {activeTab === "saved" 
                ? "No saved profiles yet" 
                : activeTab === "filter" 
                  ? "No profiles match your filters" 
                  : "No profiles found"}
            </div>
          )}
        </div>
        
        {/* Filter results counter */}
        {activeTab === "filter" && !showFilterPanel && displayedProfiles.length > 0 && (
          <div className="p-2 text-xs text-center border-t border-gray-200">
            Showing {displayedProfiles.length} of {matches.length} profiles
          </div>
        )}
      </div>

      {/* Main content area */}
      <div className="flex-1 h-full overflow-y-auto">
        {student ? (
          <div className="p-6 max-w-6xl mx-auto">
            {/* Header with save button */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Profile Details
              </h2>
              <button
                className="flex items-center px-3 py-1 text-sm rounded-md border border-gray-200 hover:bg-gray-50"
                onClick={(e) => toggleSave(selectedId, e)}
              >
                <span className="mr-1">
                  {savedProfiles.includes(selectedId) ? "🔖" : "☆"}
                </span>
                {savedProfiles.includes(selectedId) ? "Saved" : "Save Profile"}
              </button>
            </div>
            
            {/* Overview Section */}
            <div className="bg-white border-b border-gray-200 pb-5 mb-6">
              <Overview data={student.demographics} tags={student.flair} />
            </div>

            {/* Main content in a clean grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Column 1: Academics & Awards */}
              <div className="md:col-span-3">
                <div className="mb-6">
                  <Academics data={student.academics} />
                </div>

                <div>
                  <Awards data={student.awards} />
                </div>
              </div>

              {/* Column 2: Extracurriculars */}
              <div className="md:col-span-6">
                <div>
                  <Extracurriculars data={student.extracurricular_activities} />
                </div>
              </div>

              {/* Column 3: Decisions */}
              <div className="md:col-span-3">
                <div>
                  <Decisions data={student.decisions} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center p-6">
              <p className="text-gray-500">Select a profile to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileDisplay;