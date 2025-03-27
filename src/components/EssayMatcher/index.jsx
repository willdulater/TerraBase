import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "@headlessui/react";

/**
 * EssayMatcher Component
 *
 * This component provides a UI for users to browse and save college essays that match their profile.
 * It shows essays that are relevant to the user's demographics, academics, and extracurricular activities.
 *
 * @param {Object} props
 * @param {WebSocket} props.socket - WebSocket connection for real-time data
 * @param {string} props.gender - User's gender
 * @param {number} props.unweightedGpa - User's unweighted GPA
 * @param {Array} props.extracurriculars - User's extracurricular activities
 * @param {Function} props.setSelectedMode - Function to change the app mode
 */
const EssayMatcher = ({
  socket,
  gender,
  unweightedGpa,
  extracurriculars,
  setSelectedMode,
}) => {
  const { user } = useAuth0();

  // ==================== State Management ====================

  // Core data states
  const [essayData, setEssayData] = useState([]);
  const [matches, setMatches] = useState([]);
  const [distances, setDistances] = useState([]);

  // UI states
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingEssays, setLoadingEssays] = useState(false);
  const [propsInitialized, setPropsInitialized] = useState(false);

  // Essay viewer states
  const [selectedId, setSelectedId] = useState(null);
  const [selectedEssayNumber, setSelectedEssayNumber] = useState(1);
  const [activeTab, setActiveTab] = useState("all"); // "all", "saved", or "filter"
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    essayType: {
      commonapp: true,
      shortquestion: true,
      supplemental: true,
    },
    category: {
      "Academic Interest": true,
      Extracurricular: true,
      "Intellectual Curiosity": true,
      "Why College": true,
      "Personal Identity and Community": true,
      "Community Engagement and Service": true,
      "Creative and Inspirational Thinking": true,
      General: true,
    },
  });

  // Sort criteria state
  const [sortCriteria, setSortCriteria] = useState({
    criteria: "similarity", // Default sort by similarity
    direction: "desc", // Default sort direction (descending)
  });

  // ==================== Profile Completion Check ====================

  /**
   * Determines if the user profile is complete enough to use the essay matcher
   */
  const isProfileComplete =
    (gender || localStorage.getItem("demographics_filled") === "true") &&
    (unweightedGpa || localStorage.getItem("academics_filled") === "true") &&
    (extracurriculars.length >= 3 ||
      localStorage.getItem("extracurriculars_filled") === "true");

  // ==================== Effects ====================

  /**
   * Track when props are initialized
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
  }, [socket, matches.length, essayData.length]);

  // ==================== WebSocket Handlers ====================

  /**
   * Process different types of WebSocket messages
   * @param {Object} data - The parsed WebSocket message
   */
  const handleWebsocketMessage = (data) => {
    switch (data.websocket_type) {
      case "getcollegeessays":
        handleEssayData(data);
        break;
      case "essaymatcher":
        handleMatchData(data);
        break;
      case "savecollegeessay":
        handleSaveEssay(data);
        break;
    }
  };

  /**
   * Handle essay data from the server
   */
  const handleEssayData = (data) => {
    setLoadingEssays(false);

    // Ensure we have essays and they're in an array format
    if (data.essays && Array.isArray(data.essays)) {
      setEssayData(data.essays);

      // Check if both essay and match data have been loaded
      if (matches.length > 0) {
        setShowResults(true);
      }
    } else {
      console.error("Invalid essays data format:", data.essays);
      toast.error("Error loading essays: Invalid data format");
    }
  };

  /**
   * Handle essay match data from the server
   */
  const handleMatchData = (data) => {
    setLoading(false);
  //  console.log("Received Essay Matches:", data.matches);
  //  console.log("Received Essay Distances:", data.distances);

    // Convert object to array
    const matchesArray = Object.values(data.matches).flat();
    const distancesArray = transformDistances(
      Object.values(data.distances).flat()
    );

  //  console.log("Converted Essay Matches:", matchesArray);
  //  console.log("Converted Essay Distances:", distancesArray);

    // Ensure they are arrays before setting state
    if (Array.isArray(matchesArray) && Array.isArray(distancesArray)) {
      setMatches(matchesArray);
      setDistances(distancesArray);

      // Set the initially selected essay
      if (matchesArray.length > 0) {
        setSelectedId(Number(matchesArray[0]));
      }

      // Check if both essay and match data have been loaded
      if (essayData.length > 0) {
        setShowResults(true);
      }
    } else {
  //    console.error("Data received is not an array!");
      toast.error("Invalid data format received.");
    }
  };

  /**
   * Handle save essay response from the server
   */
  const handleSaveEssay = (data) => {
    // Update saved status in our local state
    setEssayData((prevData) =>
      prevData.map((essay) => {
        // Match by essay_id (the primary field from backend)
        if (Number(essay.essay_id) === Number(data.essay_id)) {
          return { ...essay, is_saved: data.is_saved };
        }
        return essay;
      })
    );
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
    setLoadingEssays(true);

    // Request essay data
    socket.send(
      JSON.stringify({
        websocket_type: "getcollegeessays",
      })
    );

    // Request essay matches if user is authenticated
    if (user && user.sub) {
      socket.send(
        JSON.stringify({
          websocket_type: "essaymatcher",
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
   * Find an essay by ID
   * @param {number} id - The essay ID to find
   * @returns {Object|null} The found essay or null
   */
  const findEssayById = (id) => {
    if (!essayData || essayData.length === 0) return null;
    return essayData.find((essay) => Number(essay.essay_id) === Number(id));
  };

  /**
   * Convert percentage similarity to star rating (0-5 stars)
   * @param {number} similarityPercentage - The similarity percentage
   * @returns {number} Star rating from 0-5
   */
  const calculateStarRating = (similarityPercentage) => {
    if (!similarityPercentage) return 0;
    const percentage = parseFloat(similarityPercentage);
    return Math.min(5, Math.round((percentage / 50) * 5)); // Inflate stars by using 50 instead of 100
  };

  /**
   * Calculate approximate word count from text
   * @param {string} text - The text to count words in
   * @returns {number} Approximate word count
   */
  const calculateWordCount = (text) => {
    if (!text) return 0;
    return text.split(/\s+/).length;
  };

  // ==================== Filtering & Sorting ====================

  /**
   * Toggle a filter option
   * @param {string} category - The category to toggle (essayType or category)
   * @param {string} option - The specific option to toggle
   */
  const toggleFilter = (category, option) => {
    setFilters((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [option]: !prev[category][option],
      },
    }));
  };

  /**
   * Reset filters to default (all enabled)
   */
  const resetFilters = () => {
    setFilters({
      essayType: {
        commonapp: true,
        shortquestion: true,
        supplemental: true,
      },
      category: {
        "Academic Interest": true,
        Extracurricular: true,
        "Intellectual Curiosity": true,
        "Why College": true,
        "Personal Identity and Community": true,
        "Community Engagement and Service": true,
        "Creative and Inspirational Thinking": true,
        General: true,
      },
    });
  };

  /**
   * Check if an essay passes the current filters
   * @param {Object} essay - The essay to check
   * @returns {boolean} True if the essay passes the filters
   */
  const applyFilters = (essay) => {
    if (!essay) return false;

    // Essay Type Filter
    const essayTypeLower = essay.type ? essay.type.toLowerCase() : "";
    if (
      (essayTypeLower === "commonapp" && !filters.essayType.commonapp) ||
      (essayTypeLower === "shortquestion" &&
        !filters.essayType.shortquestion) ||
      (essayTypeLower === "supplemental" && !filters.essayType.supplemental)
    ) {
      return false;
    }

    // Category Filter
    if (essay.category && !filters.category[essay.category]) {
      return false;
    }

    return true;
  };

  /**
   * Get the value to sort an essay by
   * @param {number} essayId - The essay ID
   * @returns {number} The value to sort by
   */
  const getEssaySortValue = (essayId) => {
    const essay = essayData.find((e) => Number(e.essay_id) === Number(essayId));
    if (!essay) return 0;

    // Find the similarity value for this essay
    const index = matches.findIndex((id) => Number(id) === Number(essayId));
    const similarity = parseFloat(distances[index] || 0);

    switch (sortCriteria.criteria) {
      case "similarity":
        return similarity;
      case "wordCount":
        // Approximate word count based on essay text length
        return essay.essay?.split(/\s+/).length || 0;
      default:
        return similarity;
    }
  };

  /**
   * Sort essays based on current sort criteria
   * @param {Array} essayList - Array of essay IDs
   * @returns {Array} Sorted array of essay IDs
   */
  const getSortedEssays = (essayList) => {
    return [...essayList].sort((idA, idB) => {
      const valueA = getEssaySortValue(idA);
      const valueB = getEssaySortValue(idB);

      if (sortCriteria.direction === "asc") {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    });
  };

  /**
   * Get the list of essays to display based on active tab and filters
   * @returns {Array} Array of essay IDs to display
   */
  const getDisplayedEssays = () => {
    if (!Array.isArray(matches) || matches.length === 0) {
      return [];
    }

    let filteredMatches = matches;

    // Filter by saved status if on saved tab
    if (activeTab === "saved") {
      filteredMatches = matches.filter((id) => {
        const essay = essayData.find((e) => Number(e.essay_id) === Number(id));
        return essay?.is_saved;
      });
    }

    // Apply category and type filters
    filteredMatches = filteredMatches.filter((id) => {
      const essay = essayData.find((e) => Number(e.essay_id) === Number(id));
      return applyFilters(essay);
    });

    return getSortedEssays(filteredMatches);
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

  // Get the essays to display after filtering and sorting
  const displayedEssays = getDisplayedEssays();

  // Get the currently selected essay
  const essay = selectedId ? findEssayById(selectedId) : null;

  // ==================== UI Helpers ====================

  /**
   * Format essay type for display
   * @param {string} type - Raw essay type
   * @returns {string} Formatted essay type
   */
  const formatEssayType = (type) => {
    if (!type) return "";

    switch (type.toLowerCase()) {
      case "commonapp":
        return "Common App Essay";
      case "shortquestion":
        return "Short Answer";
      case "supplemental":
        return "Supplemental Essay";
      default:
        return type;
    }
  };

  /**
   * Get the icon for an essay category
   * @param {string} category - The essay category
   * @returns {string} Icon path or emoji
   */
  function getEssayCategoryIcon(category) {
    if (!category) return "📝";

    const c = category.toLowerCase();
    if (c.includes("academic") || c.includes("interest"))
      return "academicinterest.svg";
    if (c.includes("intellectual") || c.includes("curiosity"))
      return "intellectualcuriosity.svg";
    if (c.includes("personal") || c.includes("identity"))
      return "personalidentity.svg";
    if (c.includes("community") || c.includes("service"))
      return "communityservice.svg";
    if (c.includes("why") || c.includes("college")) return "whycollege.svg";
    if (c.includes("extracurricular")) return "extracurricular.svg";
    if (c.includes("creative") || c.includes("inspirational"))
      return "creative.svg";
    if (c.includes("general")) return "general.svg";

    return "📝";
  }

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
   * Toggle saving/unsaving an essay
   * @param {number} id - The essay ID
   * @param {Event} e - The event object
   */
  const toggleSave = (id, e) => {
    if (e) e.stopPropagation(); // Prevent triggering parent onClick
    const essayId = Number(id);

    // Find essay data by essay_id
    const essay = essayData.find((e) => Number(e.essay_id) === essayId);
    if (!essay) {
      console.error(`Essay with ID ${essayId} not found`);
      return;
    }

    // Calculate the new saved state
    const newSavedState = !essay.is_saved;

    // Optimistically update UI immediately
    setEssayData((prevData) =>
      prevData.map((e) =>
        Number(e.essay_id) === essayId ? { ...e, is_saved: newSavedState } : e
      )
    );

    // Then send WebSocket message to update backend
    socket.send(
      JSON.stringify({
        websocket_type: "savecollegeessay",
        essay_id: essayId,
        is_saved: newSavedState, // Explicitly pass the new state to the server
      })
    );

    console.log(`Toggled save for essay ${essayId} to ${newSavedState}`);
  };

  /**
   * Request essay data from the server
   * @param {Event} e - The event object
   */
  const getCollegeEssays = (e) => {
    e.preventDefault();
    setLoadingEssays(true);
    socket.send(
      JSON.stringify({
        websocket_type: "getcollegeessays",
      })
    );
  };
  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Show profile completion checklist if profile is incomplete */}
        {!isProfileComplete && (
          <div className="flex-1 flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100">
            <ProfileCompletionChecklist
              gender={gender}
              unweightedGpa={unweightedGpa}
              extracurriculars={extracurriculars}
            />
          </div>
        )}

        {/* Show loading spinner when fetching data */}
        {isProfileComplete && !showResults && (
          <div className="flex-1 flex justify-center items-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Finding essays for you...</p>
            </div>
          </div>
        )}

        {/* Show results when data is loaded */}
        {isProfileComplete && showResults && (
          <AnimatePresence>
            {loading || loadingEssays ? (
              <div className="flex-1 flex justify-center items-center">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600">Finding essays for you...</p>
                </div>
              </div>
            ) : matches.length > 0 && distances.length > 0 ? (
              // Added a check to debug essayData issues
              essayData.length === 0 ? (
                <div className="flex-1 flex justify-center items-center">
                  <div className="flex flex-col items-center">
                    <p className="text-orange-600 font-bold">
                      Warning: Match data is ready but no essay data was loaded
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
                      Essay Matcher
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

                  {/* Content area with sidebar and essay details */}
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
                          <button
                            className={`flex-1 py-1 ${
                              activeTab === "filter"
                                ? "bg-[#0f4d92] text-white"
                                : "text-gray-600"
                            }`}
                            onClick={() => {
                              setActiveTab("filter");
                              setShowFilterPanel(true);
                            }}
                          >
                            Filter
                          </button>
                        </div>
                      </div>

                      {/* Filter/Sort panel */}
                      {showFilterPanel ? (
                        <div className="p-4 bg-[#F4FAFE] rounded-lg space-y-4">
                          {/* Sort Options - Moved to Top */}
                          <div>
                            <h4 className="text-xs font-semibold text-gray-700 mb-1">
                              Sort By
                            </h4>
                            <div className="space-y-1">
                              {["similarity", "wordCount"].map((criteria) => (
                                <button
                                  key={criteria}
                                  onClick={() => updateSortCriteria(criteria)}
                                  className={`w-full text-left px-3 py-2 rounded text-xs ${
                                    sortCriteria.criteria === criteria
                                      ? "bg-blue-100 text-blue-700 font-medium"
                                      : "hover:bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  {criteria.charAt(0).toUpperCase() +
                                    criteria.slice(1)}{" "}
                                  {sortCriteria.criteria === criteria &&
                                    (sortCriteria.direction === "desc"
                                      ? "↓"
                                      : "↑")}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Essay Type Filter */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-800 mb-2">
                              Essay Type
                            </h4>
                            {["commonapp", "supplemental", "shortquestion"].map(
                              (type) => (
                                <div
                                  key={type}
                                  className="flex items-center justify-between mb-2 space-x-4"
                                >
                                  <span className="text-sm text-gray-800 mr-4">
                                    {formatEssayType(type)}
                                  </span>
                                  <Switch
                                    checked={filters.essayType[type]}
                                    onChange={() =>
                                      toggleFilter("essayType", type)
                                    }
                                    className={`${
                                      filters.essayType[type]
                                        ? "bg-[#009068]"
                                        : "bg-[#E81B1B]"
                                    } relative inline-flex h-4 w-8 items-center rounded-full shrink-0 transition ease-in-out duration-300`}
                                  >
                                    <span className="sr-only">
                                      Toggle {type}
                                    </span>
                                    <span
                                      className={`${
                                        filters.essayType[type]
                                          ? "translate-x-4"
                                          : "translate-x-1"
                                      } inline-block h-3 w-3 transform rounded-full bg-white transition ease-in-out duration-300`}
                                    />
                                  </Switch>
                                </div>
                              )
                            )}
                          </div>

                          {/* Essay Category Filter */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-800 mb-2">
                              Essay Category
                            </h4>
                            {Object.keys(filters.category).map((category) => (
                              <div
                                key={category}
                                className="flex items-center justify-between mb-2 space-x-4"
                              >
                                <span className="text-sm text-gray-800 mr-4">
                                  {category}
                                </span>
                                <Switch
                                  checked={filters.category[category]}
                                  onChange={() =>
                                    toggleFilter("category", category)
                                  }
                                  className={`${
                                    filters.category[category]
                                      ? "bg-[#009068]"
                                      : "bg-[#E81B1B]"
                                  } relative inline-flex h-4 w-8 items-center rounded-full shrink-0 transition ease-in-out duration-300`}
                                >
                                  <span className="sr-only">
                                    Toggle {category}
                                  </span>
                                  <span
                                    className={`${
                                      filters.category[category]
                                        ? "translate-x-4"
                                        : "translate-x-1"
                                    } inline-block h-3 w-3 transform rounded-full bg-white transition ease-in-out duration-300`}
                                  />
                                </Switch>
                              </div>
                            ))}
                          </div>

                          {/* Reset Filters */}
                          <div className="text-center mt-4">
                            <button
                              onClick={resetFilters}
                              className="px-4 py-2 bg-[#0f4d92] hover:bg-blue-600 text-white text-xs font-medium rounded-md transition-colors duration-200"
                            >
                              Reset All
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 overflow-y-auto max-h-full">
                          {displayedEssays.length > 0 ? (
                            displayedEssays.map((essayId, index) => {
                              const originalIndex = matches.findIndex(
                                (id) => id === essayId
                              );
                              const rating = calculateStarRating(
                                distances[originalIndex]
                              );

                              // Find the corresponding essay in essayData to display additional info
                              const essayItem = essayData.find(
                                (e) => Number(e.essay_id) === Number(essayId)
                              );
                              const isSaved = essayItem?.is_saved || false;

                              return (
                                <div
                                  key={essayId}
                                  className={`p-3 mb-1 border-b border-gray-100 cursor-pointer transition-colors ${
                                    Number(essayId) === selectedId
                                      ? "bg-[#C8E4FC] border-l-2 border-l-blue-500"
                                      : "hover:bg-gray-50 border-l-2 border-l-transparent"
                                  }`}
                                  onClick={() => {
                                    setSelectedId(Number(essayId));
                                    setSelectedEssayNumber(index + 1);
                                  }}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                      {renderStarRating(rating)}
                                    </div>
                                    <button
                                      onClick={(e) => toggleSave(essayId, e)}
                                      className="text-lg focus:outline-none"
                                      title={
                                        isSaved
                                          ? "Remove from saved"
                                          : "Save essay"
                                      }
                                    >
                                      {isSaved ? "🔖" : "☆"}
                                    </button>
                                  </div>

                                 

                                  {/* Similarity label */}
                                  <div className="text-xs text-black mb-1 ">
                                    {getSimilarityLabel(rating)}
                                  </div>
                                   {/* Only show category */}
                                   {essayItem && essayItem.category && (
                                    <div className="text-xs text-gray-500">
                                      {essayItem.category}
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <div className="p-4 text-center text-gray-500 text-xs">
                              {activeTab === "saved"
                                ? "No saved essays yet"
                                : activeTab === "filter"
                                ? "No essays match your filters"
                                : "No essays found"}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Essay counter */}
                      {!showFilterPanel && displayedEssays.length > 0 && (
                        <div className="p-2 text-xs text-center border-t border-gray-200">
                          Showing {selectedEssayNumber} of {displayedEssays.length}{" "}
                          essays
                        </div>
                      )}
                    </div>

                    {/* Main Content - Essay Details - should also scroll independently */}

                    <div className="flex-1 overflow-y-auto h-[calc(100vh-56px)]">
                      {essay ? (
                        <div className="p-8 max-w-6xl mx-auto space-y-6 bg-gray-50">
                          {/* Header with save button and decorative image */}
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                              <img
                                src="essay.svg"
                                alt="Essay icon"
                                className="w-12 h-12 object-cover"
                              />
                              <h2 className="text-2xl font-bold text-gray-900">
                                Essay Details
                              </h2>
                            </div>
                            <button
                              className={`flex items-center px-3 py-1 text-sm rounded-md border ${
                                essay.is_saved
                                  ? "border-yellow-300 bg-yellow-50 "
                                  : "border-gray-200 hover:bg-gray-50 text-gray-700"
                              } transition-colors duration-150 ease-in-out`}
                              onClick={(e) => toggleSave(selectedId, e)}
                            >
                              <span className="mr-1 text-base">
                                {essay.is_saved ? "★" : "☆"}
                              </span>
                              {essay.is_saved ? "Save Profile" : "Save Profile"}
                            </button>
                          </div>

                          {/* Essay metadata with icons */}
                          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {/* School */}
                              <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                  <img
                                    src="education.svg"
                                    alt="School logo"
                                    className="w-12 h-12"
                                  />
                                </div>
                                <div>
                                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                    School
                                  </h3>
                                  <p className="text-sm text-gray-900 font-medium">
                                    {essay.school}
                                  </p>
                                </div>
                              </div>

                              {/* Essay Type */}
                              <div className="flex items-center space-x-4">
                                <img
                                  src="write.svg"
                                  alt="School logo"
                                  className="w-12 h-12"
                                />

                                <div>
                                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                    Essay Type
                                  </h3>
                                  <p className="text-sm text-gray-900 font-medium">
                                    {formatEssayType(essay.type)}
                                  </p>
                                </div>
                              </div>

                              {/* Category with themed icon */}
                              <div className="flex items-center space-x-4">
                                <img
                                  src={getEssayCategoryIcon(essay.category)}
                                  alt="School logo"
                                  className="w-12 h-12"
                                />

                                <div>
                                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                    Category
                                  </h3>
                                  <p className="text-sm text-gray-900 font-medium">
                                    {essay.category}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Essay prompt with visual indicator */}
                          {essay.question?.trim() && (
                            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md relative">
                              <div className="absolute -top-3 left-4 bg-[#0f4d92] px-3 py-1 rounded-full text-xs font-semibold text-white ">
                                Prompt
                              </div>
                              <div className="flex items-center pt-2">
                                <div className="prose max-w-none text-gray-700">
                                  <p
                                    style={{ whiteSpace: "pre-wrap" }}
                                    className="italic"
                                  >
                                    {essay.question}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Essay content with sidebar images */}
                          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md relative">
                            <div className="absolute -top-3 left-4 bg-blue-100 px-3 py-1 rounded-full text-xs font-semibold text-blue-800">
                              Essay Content
                            </div>

                            <div className="flex pt-2">
                              <div className="prose max-w-none text-gray-700 flex-grow pr-4">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                  Essay
                                </h3>
                                <p
                                  style={{ whiteSpace: "pre-wrap" }}
                                  className="relative"
                                >
                                  {essay.essay}
                                </p>
                              </div>
                            </div>

                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                              <div className="flex items-center">
                                <img
                                  src="wordcount.svg"
                                  alt="Word count"
                                  className="w-5 h-5 mr-2"
                                />
                                <span className="text-xs text-gray-500">
                                  ~ {calculateWordCount(essay.essay)} words
                                </span>
                              </div>

                              <div className="flex items-center">
                                <span className="text-xs text-gray-500 mr-2">
                                  Similarity:
                                </span>
                                {renderStarRating(
                                  calculateStarRating(
                                    distances[
                                      matches.findIndex(
                                        (id) =>
                                          Number(id) === Number(selectedId)
                                      )
                                    ]
                                  )
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Optional Tips section (uncommented and enhanced)
                       <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 shadow-sm">
                         <div className="flex items-start">
                           <div className="flex-shrink-0 mr-4">
                             <img 
                               src="/api/placeholder/64/64" 
                               alt="Tips icon" 
                               className="w-12 h-12 rounded-lg object-cover border border-blue-200" 
                             />
                           </div>
                           <div>
                             <h3 className="text-lg font-semibold text-gray-900 mb-4">Why This Essay Works</h3>
                             <div className="prose max-w-none text-gray-700">
                               <p>This essay demonstrates several key strengths that admission officers look for:</p>
                               <ul className="mt-2 list-disc list-inside">
                                 <li>Authentic voice that reveals the applicant's personality</li>
                                 <li>Specific examples rather than general statements</li>
                                 <li>Shows rather than tells about personal qualities</li>
                                 <li>Clear structure with introduction, body, and conclusion</li>
                                 <li>Appropriate tone for an academic audience</li>
                               </ul>
                               <p className="mt-4 text-sm text-blue-600">
                                 This essay was matched to your profile because it aligns with your interests, academic focus, or extracurricular activities.
                               </p>
                             </div>
                           </div>
                         </div>
                       </div>
                       */}
                        </div>
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <div className="text-center p-6">
                            <p className="text-gray-500">
                              Select an essay to view details
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
                  No matching essays found or data still loading.
                </p>
              </div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

// Profile Completion Checklist Component
const ProfileCompletionChecklist = ({
  gender,
  unweightedGpa,
  extracurriculars,
}) => {
  const demographicsFilled =
    gender || localStorage.getItem("demographics_filled") === "true";
  const academicsFilled =
    unweightedGpa || localStorage.getItem("academics_filled") === "true";
  const extracurricularsFilled =
    extracurriculars.length >= 3 ||
    localStorage.getItem("extracurriculars_filled") === "true";

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-sm max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-1">
        Essay Matcher
      </h2>
      <p className="text-gray-600 text-sm mb-4 text-center">
        Our matching algorithms will find essays similar to your profile,
        showing you essays with topics that match your interests and background.
      </p>

      <div className="w-full border-t border-gray-100 pt-4 mb-4">
        <h3 className="text-base font-medium text-gray-700 mb-2">
          Complete Your Profile:
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
          <li style={{ color: demographicsFilled ? "#34D399" : "#EF4444" }}>
            {demographicsFilled ? "✔️" : "❌"} Fill in Demographics
          </li>
          <li style={{ color: academicsFilled ? "#34D399" : "#EF4444" }}>
            {academicsFilled ? "✔️" : "❌"} Fill in Academics
          </li>
          <li
            style={{
              color: extracurricularsFilled ? "#34D399" : "#EF4444",
            }}
          >
            {extracurricularsFilled ? "✔️" : "❌"} Include at least 3
            Extracurriculars
          </li>
        </ul>
      </div>

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
              ((demographicsFilled ? 1 : 0) +
                (academicsFilled ? 1 : 0) +
                (extracurricularsFilled ? 1 : 0)) *
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
        {demographicsFilled && academicsFilled && extracurricularsFilled
          ? "Profile Complete! Start Exploring Essays."
          : "Complete your profile to access essay matching."}
      </p>
    </div>
  );
};

export default EssayMatcher;
