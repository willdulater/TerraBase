import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Awards from "./Awards";
import Academics from "./Academics";
import Extracurriculars from "./Extracurriculars";
import Decisions from "./Decisions";
import Overview from "./Overview";

/**
 * ProfileMatcher Component
 *
 * This component provides a UI for users to browse and save applicant profiles that match their own.
 * It shows profiles that are relevant to the user's demographics, academics, and extracurricular activities.
 *
 * @param {Object} props
 * @param {WebSocket} props.socket - WebSocket connection for real-time data
 * @param {string} props.gender - User's gender
 * @param {number} props.unweightedGpa - User's unweighted GPA
 * @param {Array} props.extracurriculars - User's extracurricular activities
 * @param {Function} props.setSelectedMode - Function to change the app mode
 */
const ProfileMatcher = ({
  socket,
  gender,
  unweightedGpa,
  extracurriculars,
  setSelectedMode,
}) => {
  const { user } = useAuth0();

  // ==================== State Management ====================

  // Core data states
  const [applicantData, setApplicantData] = useState([]);
  const [matches, setMatches] = useState([]);
  const [distances, setDistances] = useState([]);

  // UI states
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [propsInitialized, setPropsInitialized] = useState(false);

  // Profile viewer states
  const [selectedId, setSelectedId] = useState(null);
  const [selectedProfileNumber, setSelectedProfileNumber] = useState(1);
  const [activeTab, setActiveTab] = useState("all"); // "all", "saved", or "filter"
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Sort criteria state
  const [sortCriteria, setSortCriteria] = useState({
    criteria: "similarity", // Default sort by similarity
    direction: "desc", // Default sort direction (descending)
  });

  // ==================== Profile Completion Check ====================

  /**
   * Determines if the user profile is complete enough to use the profile matcher
   */
  const isProfileComplete =
    (gender || localStorage.getItem("demographics_filled") === "true") &&
    (unweightedGpa || localStorage.getItem("academics_filled") === "true") &&
    (extracurriculars.length >= 3 ||
      localStorage.getItem("extracurriculars_filled") === "true");

  // ==================== Effects ====================

  /**
   * Track when props are initialized and save profile completion status
   */
  useEffect(() => {
    if (gender) localStorage.setItem("demographics_filled", "true");
    if (unweightedGpa) localStorage.setItem("academics_filled", "true");
    if (extracurriculars.length >= 3)
      localStorage.setItem("extracurriculars_filled", "true");

    // Mark props as initialized once we have real values
    if (
      !propsInitialized &&
      (gender || unweightedGpa || extracurriculars.length > 0)
    ) {
      setPropsInitialized(true);
    }
  }, [gender, unweightedGpa, extracurriculars, propsInitialized]);

  /**
   * Preload data when profile is complete
   */
  useEffect(() => {
    if (isProfileComplete) {
      preloadData();
    }
  }, [isProfileComplete]);

  /**
   * Debug selected student data
   */
  useEffect(() => {
    if (selectedId && applicantData.length > 0) {
      console.log("Selected ID:", selectedId, "Type:", typeof selectedId);
      // Log user_id values for the first few items
      console.log(
        "First few applicant user_ids:",
        applicantData.slice(0, 3).map((a) => ({
          user_id: a.user_id,
          type: typeof a.user_id,
        }))
      );
      console.log("Found student:", findStudentById(selectedId));
    }
  }, [selectedId, applicantData]);

  /**
   * Handle WebSocket messages
   */
  useEffect(() => {
    if (!socket) {
      console.error("WebSocket is null.");
      return;
    }

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log("Received websocket data:", data);

      if (data["error"]) {
        toast.error(data["error"]);
        return;
      }

      handleWebsocketMessage(data);
    };
  }, [socket, matches.length, applicantData.length]);

  // ==================== WebSocket Handlers ====================

  /**
   * Process different types of WebSocket messages
   * @param {Object} data - The parsed WebSocket message
   */
  const handleWebsocketMessage = (data) => {
    switch (data.websocket_type) {
      case "getapplicantprofiles":
        handleProfileData(data);
        break;
      case "profilematcher":
        handleMatchData(data);
        break;
      case "saveapplicantprofile":
        // This is handled optimistically in the toggleSave function
        break;
      default:
        // Ignore unrecognized message types
        break;
    }
  };

  /**
   * Handle profile data from the server
   */
  const handleProfileData = (data) => {
    setLoadingProfiles(false);

    // Ensure we have profiles and they're in an array format
    if (data.profiles && Array.isArray(data.profiles)) {
      setApplicantData(data.profiles);

      // Check if both profile and match data have been loaded
      if (matches.length > 0) {
        setShowResults(true);
      }
    } else {
      console.error("Invalid profiles data format:", data.profiles);
      toast.error("Error loading profiles: Invalid data format");
    }
  };

  /**
   * Handle match data from the server
   */
  const handleMatchData = (data) => {
    setLoading(false);
    console.log("Received Matches:", data.matches);
    console.log("Received Distances:", data.distances);

    // Convert object to array
    const matchesArray = Object.values(data.matches).flat();
    const distancesArray = transformDistances(
      Object.values(data.distances).flat()
    );

    console.log("Converted Matches:", matchesArray);
    console.log("Converted Distances:", distancesArray);

    // Ensure they are arrays before setting state
    if (Array.isArray(matchesArray) && Array.isArray(distancesArray)) {
      setMatches(matchesArray);
      setDistances(distancesArray);

      // Set the initially selected profile
      if (matchesArray.length > 0) {
        setSelectedId(Number(matchesArray[0]));
      }

      // Check if both profile and match data have been loaded
      if (applicantData.length > 0) {
        setShowResults(true);
      }
    } else {
      console.error("Data received is not an array!");
      toast.error("Invalid data format received.");
    }
  };

  // ==================== Data Operations ====================

  /**
   * Preload data from the server
   */
  const preloadData = () => {
    if (!socket) {
      console.error("WebSocket is null.");
      return;
    }

    setLoading(true);
    setLoadingProfiles(true);

    // Request applicant profiles
    socket.send(
      JSON.stringify({
        websocket_type: "getapplicantprofiles",
      })
    );

    // Request profile matches if user is authenticated
    if (user && user.sub) {
      socket.send(
        JSON.stringify({
          websocket_type: "profilematcher",
          id: user.sub,
        })
      );
    }
  };

  /**
   * Calculate similarity percentage from distance value
   * @param {number} distance - The distance value
   * @param {Array} distancesArray - Array of all distances
   * @returns {string} The similarity percentage as a string
   */
  const calculateSimilarity = (distance, distancesArray) => {
    if (!Array.isArray(distancesArray) || distancesArray.length === 0) {
      console.error("Invalid distances array");
      return 0;
    }

    const maxDistance = Math.max(...distancesArray);
    if (maxDistance === 0) return 0;

    const similarity = (1 - distance / maxDistance) * 100;
    return similarity.toFixed(2);
  };

  /**
   * Transform raw distances into similarity percentages
   * @param {Array} distancesArray - Array of distance values
   * @returns {Array} Array of similarity percentages
   */
  const transformDistances = (distancesArray) => {
    if (!Array.isArray(distancesArray) || distancesArray.length === 0) {
      console.error("Invalid distances array");
      return [];
    }

    return distancesArray.map((distance) =>
      calculateSimilarity(distance, distancesArray)
    );
  };

  /**
   * Find a student profile by ID
   * @param {number} id - The student ID to find
   * @returns {Object|null} The found student or null
   */
  const findStudentById = (id) => {
    if (!applicantData || applicantData.length === 0) return null;
    return applicantData.find(
      (student) => Number(student.user_id) === Number(id)
    );
  };

  /**
   * Convert percentage similarity to star rating (0-5 stars)
   * @param {number} similarityPercentage - The similarity percentage
   * @returns {number} Star rating from 0-5
   */
  const calculateStarRating = (similarityPercentage) => {
    if (!similarityPercentage) return 0;
    const percentage = parseFloat(similarityPercentage);
    return Math.min(5, Math.round(Math.pow(percentage / 100, 0.8) * 5));
  };

  // ==================== Sorting & Filtering ====================

  /**
   * Get the value to sort a profile by
   * @param {number} profileId - The profile ID
   * @returns {number} The value to sort by
   */
  const getProfileSortValue = (profileId) => {
    const profile = applicantData.find(
      (s) => Number(s.user_id) === Number(profileId)
    );
    if (!profile) return 0;

    // Find the similarity value for this profile
    const index = matches.findIndex((id) => Number(id) === Number(profileId));
    const similarity = parseFloat(distances[index] || 0);

    switch (sortCriteria.criteria) {
      case "similarity":
        return similarity;
      case "gpa":
        return profile.academics?.gpa || 0;
      case "sat":
        return profile.academics?.sat_total || 0;
      case "act":
        return profile.academics?.act_composite || 0;
      case "extracurriculars":
        return profile.extracurricular_activities?.length || 0;
      case "acceptances":
        return (
          profile.decisions?.filter((d) => d.status === "Accepted").length || 0
        );
      default:
        return similarity;
    }
  };

  /**
   * Sort profiles based on current sort criteria
   * @param {Array} profileList - Array of profile IDs
   * @returns {Array} Sorted array of profile IDs
   */
  const getSortedProfiles = (profileList) => {
    return [...profileList].sort((idA, idB) => {
      const valueA = getProfileSortValue(idA);
      const valueB = getProfileSortValue(idB);

      if (sortCriteria.direction === "asc") {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    });
  };

  /**
   * Get the list of profiles to display based on active tab
   * @returns {Array} Array of profile IDs to display
   */
  const getDisplayedProfiles = () => {
    if (!Array.isArray(matches) || matches.length === 0) {
      return [];
    }

    let filteredMatches = matches;

    // Filter by saved status if on saved tab
    if (activeTab === "saved") {
      filteredMatches = matches.filter((id) => {
        const profile = applicantData.find(
          (p) => Number(p.user_id) === Number(id)
        );
        return profile?.is_saved;
      });
    }

    return getSortedProfiles(filteredMatches);
  };

  /**
   * Update sort criteria
   * @param {string} criteria - The criteria to sort by
   */
  const updateSortCriteria = (criteria) => {
    setSortCriteria((prev) => {
      if (prev.criteria === criteria) {
        // If already sorting by this criteria, toggle direction
        return {
          criteria: criteria,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      } else {
        // New criteria, default to descending
        return { criteria: criteria, direction: "desc" };
      }
    });
  };

  // Get the profiles to display after filtering and sorting
  const displayedProfiles = getDisplayedProfiles();

  // Get the currently selected student
  const student = selectedId ? findStudentById(selectedId) : null;

  // ==================== UI Helpers ====================

  /**
   * Get a descriptive label for the similarity rating
   * @param {number} rating - Star rating (0-5)
   * @returns {string} Descriptive label
   */
  const getSimilarityLabel = (rating) => {
    if (rating >= 4.0) return "Very High Similarity";
    if (rating >= 3.0) return "High Similarity";
    if (rating >= 2.0) return "Moderate Similarity";
    if (rating >= 1.0) return "Low Similarity";
    return "Very Low Similarity";
  };

  /**
   * Generate star rating elements
   * @param {number} rating - Star rating (0-5)
   * @returns {Array} Array of JSX elements
   */
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

  // ==================== User Interactions ====================

  /**
   * Toggle saving/unsaving a profile
   * @param {number} id - The profile ID
   * @param {Event} e - The event object
   */
  const toggleSave = (id, e) => {
    if (e) e.stopPropagation(); // Prevent triggering parent onClick
    const profileId = Number(id);

    // Find profile data
    const profile = applicantData.find((p) => Number(p.user_id) === profileId);
    if (!profile) return;

    // Send WebSocket message to update backend
    socket.send(
      JSON.stringify({
        websocket_type: "saveapplicantprofile",
        user_id: profileId,
      })
    );

    // Optimistically update UI (only for better user experience)
    setApplicantData((prevData) =>
      prevData.map((p) =>
        Number(p.user_id) === profileId ? { ...p, is_saved: !p.is_saved } : p
      )
    );
  };

  // ==================== Render Components ====================

  /**
   * Profile Completion Checklist Component
   *
   * Displays a checklist showing which profile sections need to be completed
   */
  const ProfileCompletionChecklist = () => {
    // Check if each section is complete
    const demographicsFilled =
      gender || localStorage.getItem("demographics_filled") === "true";
    const academicsFilled =
      unweightedGpa || localStorage.getItem("academics_filled") === "true";
    const extracurricularsFilled =
      extracurriculars.length >= 3 ||
      localStorage.getItem("extracurriculars_filled") === "true";

    // Calculate progress percentage
    const completedSections =
      (demographicsFilled ? 1 : 0) +
      (academicsFilled ? 1 : 0) +
      (extracurricularsFilled ? 1 : 0);
    const progressPercentage = completedSections * 33;
    const isComplete =
      demographicsFilled && academicsFilled && extracurricularsFilled;

    return (
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-sm max-w-md mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">
          Profile Matcher
        </h2>
        <p className="text-gray-600 text-sm mb-4 text-center">
          Our matching algorithms will find past applicants similar to you,
          their profiles, and which schools they got into.
        </p>

        <div className="w-full border-t border-gray-100 pt-4 mb-4">
          <h3 className="text-base font-medium text-gray-700 mb-2">
            Complete Your Profile:
          </h3>

          <ul className="list-none p-0 text-sm leading-7 text-left">
            <li
              className={demographicsFilled ? "text-green-500" : "text-red-500"}
            >
              {demographicsFilled ? "✔️" : "❌"} Fill in Demographics
            </li>
            <li className={academicsFilled ? "text-green-500" : "text-red-500"}>
              {academicsFilled ? "✔️" : "❌"} Fill in Academics
            </li>
            <li
              className={
                extracurricularsFilled ? "text-green-500" : "text-red-500"
              }
            >
              {extracurricularsFilled ? "✔️" : "❌"} Include at least 3
              Extracurriculars
            </li>
          </ul>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 bg-gray-200 rounded-full h-2 w-full">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        <p className="text-xs mt-2 text-gray-500">
          {isComplete
            ? "Profile Complete! Start Exploring."
            : "Complete your profile to access full features."}
        </p>
      </div>
    );
  };

  /**
   * Sort Panel Component
   * Displays options for sorting profiles
   */
  const SortPanel = () => (
    <div className="p-3 border-b border-gray-200 bg-white">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-gray-700">Sort Profiles By</h3>
      </div>

      {/* Sort options */}
      <div className="space-y-2">
        <button
          onClick={() => updateSortCriteria("similarity")}
          className={`w-full text-left px-3 py-2 rounded text-xs ${
            sortCriteria.criteria === "similarity"
              ? "bg-blue-100 text-blue-700"
              : "hover:bg-gray-100"
          }`}
        >
          Similarity{" "}
          {sortCriteria.criteria === "similarity" &&
            (sortCriteria.direction === "desc" ? "↓" : "↑")}
        </button>
        <button
          onClick={() => updateSortCriteria("gpa")}
          className={`w-full text-left px-3 py-2 rounded text-xs ${
            sortCriteria.criteria === "gpa"
              ? "bg-blue-100 text-blue-700"
              : "hover:bg-gray-100"
          }`}
        >
          GPA{" "}
          {sortCriteria.criteria === "gpa" &&
            (sortCriteria.direction === "desc" ? "↓" : "↑")}
        </button>
        <button
          onClick={() => updateSortCriteria("sat")}
          className={`w-full text-left px-3 py-2 rounded text-xs ${
            sortCriteria.criteria === "sat"
              ? "bg-blue-100 text-blue-700"
              : "hover:bg-gray-100"
          }`}
        >
          SAT Score{" "}
          {sortCriteria.criteria === "sat" &&
            (sortCriteria.direction === "desc" ? "↓" : "↑")}
        </button>
        <button
          onClick={() => updateSortCriteria("act")}
          className={`w-full text-left px-3 py-2 rounded text-xs ${
            sortCriteria.criteria === "act"
              ? "bg-blue-100 text-blue-700"
              : "hover:bg-gray-100"
          }`}
        >
          ACT Score{" "}
          {sortCriteria.criteria === "act" &&
            (sortCriteria.direction === "desc" ? "↓" : "↑")}
        </button>
        <button
          onClick={() => updateSortCriteria("extracurriculars")}
          className={`w-full text-left px-3 py-2 rounded text-xs ${
            sortCriteria.criteria === "extracurriculars"
              ? "bg-blue-100 text-blue-700"
              : "hover:bg-gray-100"
          }`}
        >
          Extracurricular Count{" "}
          {sortCriteria.criteria === "extracurriculars" &&
            (sortCriteria.direction === "desc" ? "↓" : "↑")}
        </button>
        <button
          onClick={() => updateSortCriteria("acceptances")}
          className={`w-full text-left px-3 py-2 rounded text-xs ${
            sortCriteria.criteria === "acceptances"
              ? "bg-blue-100 text-blue-700"
              : "hover:bg-gray-100"
          }`}
        >
          Acceptances{" "}
          {sortCriteria.criteria === "acceptances" &&
            (sortCriteria.direction === "desc" ? "↓" : "↑")}
        </button>
      </div>

      <div className="mt-4">
        <button
          onClick={() => setShowFilterPanel(false)}
          className="w-full py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Show profile completion checklist if profile is incomplete */}
        {!isProfileComplete && (
          <div className="flex-1 flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100">
            <ProfileCompletionChecklist />
          </div>
        )}

        {/* Show loading spinner when fetching data */}
        {isProfileComplete && !showResults && (
          <div className="flex-1 flex justify-center items-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Finding your matches...</p>
            </div>
          </div>
        )}

        {/* Show results when data is loaded */}
        {isProfileComplete && showResults && (
          <AnimatePresence>
            {loading || loadingProfiles ? (
              <div className="flex-1 flex justify-center items-center">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600">Finding your matches...</p>
                </div>
              </div>
            ) : matches.length > 0 && distances.length > 0 ? (
              // Added a check to debug applicantData issues
              applicantData.length === 0 ? (
                <div className="flex-1 flex justify-center items-center">
                  <div className="flex flex-col items-center">
                    <p className="text-orange-600 font-bold">
                      Warning: Match data is ready but no profile data was
                      loaded
                    </p>
                    <p className="text-gray-600 mt-2">
                      Try refreshing the page or check console for errors
                    </p>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 flex flex-col"
                >
                  {/* Top bar - properly positioned at the top */}
                  <div className="border-b border-gray-200 px-6 py-3 flex items-center bg-[#26457D] justify-between shadow-sm">
                    <h1 className="text-xl font-bold text-white">
                      Profile Matcher
                    </h1>
                    <button
                      className="flex items-center px-3 py-1 text-sm rounded-md border border-gray-200 hover:bg-gray-50 text-gray-700"
                      onClick={() => {
                        setSelectedMode("profile");
                      }}
                    >
                      <span className="mr-1 text-white">←</span>
                      <span className="text-white">Your Profile</span>
                    </button>
                  </div>

                  {/* Content area with sidebar and profile details */}
                  <div className="flex flex-1 overflow-hidden">
                    {/* Unified Sidebar - only this should scroll */}
                    <div className="w-64 flex-shrink-0 bg-[#F4FAFE] border-r border-gray-200 flex flex-col h-[calc(100vh-56px)] overflow-hidden">
                      <div className="p-2">
                        <div className="bg-white rounded-lg shadow-sm p-2 mb-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <img
                              src={"mortarboard.svg"} // Replace with actual avatar URL or fallback
                              alt="User Avatar"
                              className="w-6 h-6 rounded-md mr-2"
                            />
                            <span className="truncate">
                              {user?.name || "User"}
                            </span>
                          </div>
                        </div>

                        {/* Navigation tabs */}
                        <div className="flex text-xs mb-2 bg-gray-200 rounded-md overflow-hidden">
                          <button
                            className={`flex-1 py-1 ${
                              activeTab === "all"
                                ? "bg-[#0f4d92] text-white"
                                : "text-gray-600"
                            }`}
                            onClick={() => {
                              setActiveTab("all");
                              setShowFilterPanel(false);
                            }}
                          >
                            All
                          </button>
                          <button
                            className={`flex-1 py-1 ${
                              activeTab === "saved"
                                ? "bg-[#0f4d92] text-white"
                                : "text-gray-600"
                            }`}
                            onClick={() => {
                              setActiveTab("saved");
                              setShowFilterPanel(false);
                            }}
                          >
                            Saved
                          </button>
                          {/*        <button 
                          className={`flex-1 py-1 ${
                            activeTab === "filter" 
                              ? 'bg-blue-500 text-white' 
                              : 'text-gray-600'
                          }`}
                          onClick={() => {
                            setActiveTab("filter");
                            setShowFilterPanel(true);
                          }}
                        >
                          Sort
                        </button>*/}
                        </div>

                        {/* Sort indicator */}
                        {activeTab === "filter" && !showFilterPanel && (
                          <button
                            onClick={() => setShowFilterPanel(true)}
                            className="flex items-center justify-between w-full text-xs bg-blue-50 text-blue-700 p-2 rounded-md mb-2"
                          >
                            <span>
                              Sorting by: {sortCriteria.criteria} (
                              {sortCriteria.direction === "desc"
                                ? "high to low"
                                : "low to high"}
                              )
                            </span>
                            <span>↕️</span>
                          </button>
                        )}
                      </div>

                      {/* Sort panel */}
                      {showFilterPanel ? (
                        <SortPanel />
                      ) : (
                        <div className="flex-1 overflow-y-auto max-h-full">
                          {displayedProfiles.length > 0 ? (
                            displayedProfiles.map((studentId, index) => {
                              const originalIndex = matches.findIndex(
                                (id) => id === studentId
                              );
                              const rating = calculateStarRating(
                                distances[originalIndex]
                              );

                              // Find the corresponding student in applicantData to display additional info if needed
                              const profileData = applicantData.find(
                                (p) => Number(p.user_id) === Number(studentId)
                              );
                              const isSaved = profileData?.is_saved || false;

                              return (
                                <div
                                  key={studentId}
                                  className={`p-3 mb-1 border-b border-gray-100 cursor-pointer transition-colors ${
                                    Number(studentId) === selectedId
                                      ? "bg-[#C8E4FC] border-l-2 border-l-blue-500"
                                      : "hover:bg-gray-50 border-l-2 border-l-transparent"
                                  }`}
                                  onClick={() => {
                                    setSelectedId(Number(studentId));
                                    setSelectedProfileNumber(index + 1);
                                  }}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                      {renderStarRating(rating)}
                                    </div>
                                    <button
                                      onClick={(e) => toggleSave(studentId, e)}
                                      className="text-lg focus:outline-none"
                                      title={
                                        isSaved
                                          ? "Remove from saved"
                                          : "Save profile"
                                      }
                                    >
                                      {isSaved ? "🔖" : "☆"}
                                    </button>
                                  </div>

                                  

                                  {/* Similarity label */}
                                  <div className="text-xs text-black mb-1">
                                    {getSimilarityLabel(rating)}
                                  </div>


{/* Show tags if available */}
{profileData &&
                                    profileData.flair &&
                                    profileData.flair.length > 0 && (
                                      <div className="text-xs text-gray-500">
                                        {profileData.flair
                                          .slice(0, 3)
                                          .map((tag, index) => (
                                            <>
                                              {index > 0 && ", "}
                                              {tag}
                                            </>
                                          ))}
                                      </div>
                                    )}
                                  {/* Show sort value if applicable */}
                                  {sortCriteria.criteria !== "similarity" && (
                                    <div className="mt-1 text-xs text-gray-500">
                                      {sortCriteria.criteria === "gpa" &&
                                        profileData?.academics?.gpa && (
                                          <span>
                                            GPA:{" "}
                                            {profileData.academics.gpa.toFixed(
                                              1
                                            )}
                                          </span>
                                        )}
                                      {sortCriteria.criteria === "sat" &&
                                        profileData?.academics?.sat_total && (
                                          <span>
                                            SAT:{" "}
                                            {profileData.academics.sat_total}
                                          </span>
                                        )}
                                      {sortCriteria.criteria === "act" &&
                                        profileData?.academics
                                          ?.act_composite && (
                                          <span>
                                            ACT:{" "}
                                            {
                                              profileData.academics
                                                .act_composite
                                            }
                                          </span>
                                        )}
                                      {sortCriteria.criteria ===
                                        "extracurriculars" &&
                                        profileData?.extracurricular_activities && (
                                          <span>
                                            ECs:{" "}
                                            {
                                              profileData
                                                .extracurricular_activities
                                                .length
                                            }
                                          </span>
                                        )}
                                      {sortCriteria.criteria ===
                                        "acceptances" &&
                                        profileData?.decisions && (
                                          <span>
                                            Accepts:{" "}
                                            {
                                              profileData.decisions.filter(
                                                (d) => d.status === "Accepted"
                                              ).length
                                            }
                                          </span>
                                        )}
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <div className="p-4 text-center text-gray-500 text-xs">
                              {activeTab === "saved"
                                ? "No saved profiles yet"
                                : "No profiles found"}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Profile counter */}
                      {!showFilterPanel && displayedProfiles.length > 0 && (
                        <div className="p-2 text-xs text-center border-t border-gray-200">
                          Showing {selectedProfileNumber} of {matches.length}{" "}
                          profiles
                        </div>
                      )}
                    </div>

                    {/* Main Content - Profile Details - should also scroll independently */}
                    <div className="flex-1 overflow-y-auto h-[calc(100vh-56px)]">
                      {student ? (
                        <div className="p-6 max-w-6xl mx-auto">
                          {/* Header with save button */}
                          <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">
                              Profile Details
                            </h2>
                            <button
                              className={`flex items-center px-3 py-1 text-sm rounded-md border ${
                                student.is_saved
                                  ? "border-yellow-300 bg-yellow-50"
                                  : "border-gray-200 hover:bg-gray-50 text-gray-700"
                              } transition-colors duration-150 ease-in-out`}
                              onClick={(e) => toggleSave(selectedId, e)}
                            >
                              <span className="mr-1 text-base">
                                {student.is_saved ? "★" : "☆"}
                              </span>
                              {student.is_saved
                                ? "Save Profile"
                                : "Save Profile"}
                            </button>
                          </div>

                          {/* Overview Section */}
                          <div className="border-b border-gray-200 pb-5 mb-6">
                            <Overview
                              data={student.demographics}
                              tags={student.flair}
                            />
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
                                <Extracurriculars
                                  data={student.extracurricular_activities}
                                />
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
                            <p className="text-gray-500">
                              Select a profile to view details
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            ) : (
              <div className="flex-1 flex justify-center items-center">
                <p className="text-gray-600">
                  No matches found or data still loading.
                </p>
              </div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default ProfileMatcher;
