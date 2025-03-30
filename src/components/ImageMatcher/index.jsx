import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ImageMatcher Component
 *
 * Simplified component that searches for images based on query
 * and displays results from the public/input_images folder.
 *
 * @param {Object} props
 * @param {WebSocket} props.socket - WebSocket connection for real-time data
 */
const ImageMatcher = ({ socket }) => {
  // Core data states
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState([]);
  const [similarities, setSimilarities] = useState([]);
  const [distanceRange, setDistanceRange] = useState({ min: 0, max: 0 });

  // UI states
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  // Image viewer states
  const [selectedId, setSelectedId] = useState(null);
  const [selectedImageNumber, setSelectedImageNumber] = useState(1);

  // Handle WebSocket messages
  useEffect(() => {
    if (!socket) {
      console.error("WebSocket is null.");
      return;
    }
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log("ImageMatcher received:", data);

      // Handle satellite matcher data
      if (data.websocket_type === "satellitematcher") {
        setLoading(false);
        
        let matchArray = [];
        let similarityArray = [];
        
        if (data.matches) {
          matchArray = Array.isArray(data.matches) ? data.matches : Object.values(data.matches).flat();
          console.log("Processed matches:", matchArray);
        }
        
        if (data.similarities) {
          similarityArray = Array.isArray(data.similarities) ? data.similarities : Object.values(data.similarities).flat();
          console.log("Processed similarities:", similarityArray);
          
          // Calculate min and max distance for scaling
          if (similarityArray.length > 0) {
            const minDistance = Math.min(...similarityArray);
            const maxDistance = Math.max(...similarityArray);
            console.log(`Distance range: ${minDistance} to ${maxDistance}`);
            setDistanceRange({ min: minDistance, max: maxDistance });
          }
        }
        
        setMatches(matchArray);
        setSimilarities(similarityArray || []);
        
        if (matchArray.length > 0) {
          setSelectedId(matchArray[0]);
          setSelectedImageNumber(1);
        }
        
        setShowResults(true);
      }
    }
  }, [socket]);

  /**
   * Get similarity value for an image
   */
  const getImageSimilarity = (imageId) => {
    if (!imageId || !Array.isArray(matches) || !Array.isArray(similarities)) {
      return 0;
    }
    
    const index = matches.findIndex(id => id === imageId);
    return index >= 0 && index < similarities.length ? similarities[index] : 0;
  };

  /**
   * Calculate star rating based on distance
   * Dynamically scales between min and max distance values
   */
  const calculateStarRating = (distance) => {
    if (distance === undefined || distance === null) return 3;
    
    // If there's no meaningful range, default to high ratings
    if (distanceRange.min === distanceRange.max) return 5;
    
    const { min, max } = distanceRange;
    
    // Normalize distance to a 0-1 scale (closer to 0 is better)
    const normalizedDistance = (distance - min) / (max - min);
    
    // Invert the scale and map to 3-5 stars (we want lower distances to have higher ratings)
    const invertedScore = 1 - normalizedDistance;
    
    // Map to 3-5 star range
    const rating = 3 + (invertedScore * 2);
    
    // Round to nearest whole number
    return Math.round(rating);
  };

  /**
   * Get a descriptive label for the similarity rating
   */
  const getSimilarityLabel = (rating) => {
    if (rating >= 5) return "Excellent Match";
    if (rating >= 4) return "Strong Match";
    return "Good Match";
  };

  /**
   * Handle search form submission
   */
  const handleSearch = (e) => {
    if (e) e.preventDefault();
    
    if (!query.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    if (!socket) {
      console.error("WebSocket is null.");
      return;
    }

    // Reset states
    setLoading(true);
    setShowResults(false);
    
    console.log("Sending search query:", query);
    
    // Send the search query
    socket.send(
      JSON.stringify({
        websocket_type: "satellitematcher",
        question: query
      })
    );
  };

  /**
   * Generate star rating elements
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

  /**
   * Get image path based on image ID
   * Uses simple numbered filenames: 1.png, 2.png, etc.
   */
  const getImagePath = (imageId) => {
    if (!imageId) return "";
    return `/input_images/${imageId}.png`;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Search Bar */}
        <div className="border-b border-gray-200 px-6 py-3 bg-[#0B3D2E] shadow-sm">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-xl font-bold text-white mb-3">Satellite Image Search</h1>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. What land is suitable for grazing or hay production?"
                className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-[#7B5E57] hover:bg-[#5C443F] text-white px-6 py-2 rounded-md font-medium transition-colors"
                disabled={loading}
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </form>
          </div>
        </div>

        {/* Show loading spinner when fetching data */}
        {loading && (
          <div className="flex-1 flex justify-center items-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Finding satellite images for you...</p>
            </div>
          </div>
        )}

        {/* Show results when data is loaded */}
        {showResults && !loading && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              {matches.length === 0 ? (
                <div className="flex-1 flex justify-center items-center">
                  <p className="text-gray-600">No matching images found. Try a different search query.</p>
                </div>
              ) : (
                <div className="flex flex-1 overflow-hidden">
                  {/* Sidebar with image thumbnails */}
                  <div className="w-64 flex-shrink-0 bg-[#F4FAFE] border-r border-gray-200 flex flex-col h-[calc(100vh-120px)] overflow-hidden">
                    {/* Image thumbnails */}
                    <div className="flex-1 overflow-y-auto max-h-full">
                      {matches.map((imageId, index) => {
                        const similarity = getImageSimilarity(imageId);
                        const rating = calculateStarRating(similarity);

                        return (
                          <div
                            key={imageId}
                            className={`p-3 mb-1 border-b border-gray-100 cursor-pointer transition-colors ${
                              imageId === selectedId
                                ? "bg-[#4C9A2A]/25 border-l-2 border-l-blue-500"
                                : "hover:bg-gray-50 border-l-2 border-l-transparent"
                            }`}
                            onClick={() => {
                              setSelectedId(imageId);
                              setSelectedImageNumber(index + 1);
                            }}
                          >
                            <div className="flex items-center mb-2">
                              {renderStarRating(rating)}
                            </div>

                            {/* Thumbnail */}
                            <div className="rounded overflow-hidden mb-2 border border-gray-200">
                              <img 
                                src={getImagePath(imageId)} 
                                alt={`Image ${index + 1}`}
                                className="w-full h-20 object-cover"
                                onError={(e) => {
                                  console.error(`Failed to load thumbnail: ${imageId}.png`);
                                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Cpath d='M30,50 L70,50 M50,30 L50,70' stroke='%23cccccc' stroke-width='5'/%3E%3C/svg%3E";
                                }}
                              />
                            </div>

                            {/* Similarity label */}
                            <div className="text-xs text-black">
                              {getSimilarityLabel(rating)}
                            </div>
                            
                            {/* Image number */}
                            <div className="text-xs text-gray-500 mt-1">
                              Image #{imageId}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Image counter */}
                    {matches.length > 0 && (
                      <div className="p-2 text-xs text-center border-t border-gray-200">
                        Showing {selectedImageNumber} of {matches.length} images
                      </div>
                    )}
                  </div>

                  {/* Main Content - Image Details */}
                  <div className="flex-1 overflow-y-auto h-[calc(100vh-120px)]">
                    {selectedId ? (
                      <div className="p-8 max-w-6xl mx-auto bg-gray-50">
                        {/* Main image display */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
                          <div className="flex justify-center">
                            <img 
                              src={getImagePath(selectedId)} 
                              alt={`Selected satellite image`}
                              className="max-w-full max-h-[600px] object-contain"
                              onError={(e) => {
                                console.error(`Failed to load image: ${selectedId}.png`);
                                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Cpath d='M160,150 L240,150 M200,110 L200,190' stroke='%23cccccc' stroke-width='8'/%3E%3Ctext x='200' y='230' font-family='Arial' font-size='14' text-anchor='middle' fill='%23999999'%3EImage could not be loaded%3C/text%3E%3C/svg%3E";
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <div className="text-center p-6">
                          <p className="text-gray-500">
                            Select an image to view details
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Show initial state when no search has been performed */}
        {!showResults && !loading && (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-center max-w-md p-6">
              <div 
                className="w-24 h-24 mx-auto mb-4 flex items-center justify-center bg-gray-100 rounded-full"
              >
                <span className="text-4xl text-gray-400">🛰️</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Search for Satellite Images</h2>
              <p className="text-gray-600 mb-4">
                Enter a description of what you're looking for in satellite imagery. 
                Our AI will find the most relevant matches from our database.
              </p>
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageMatcher;