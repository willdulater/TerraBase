import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { motion } from "framer-motion";

// Sample awards data
// In a real implementation, this would come from your backend
const awardsData = [
  {
    id: 1,
    name: "National Merit Scholarship Finalist",
    organization: "National Merit Scholarship Corporation",
    date: "May 2023",
    level: "National",
    description: "Selected as a National Merit Finalist based on PSAT scores and academic achievements. Awarded to less than 1% of high school seniors nationwide.",
    category: "Academic",
    isFavorite: true
  },
  {
    id: 2,
    name: "First Place - Science Fair",
    organization: "State Science & Engineering Fair",
    date: "April 2023",
    level: "State",
    description: "Won first place in the Environmental Science category for research project on sustainable water filtration methods using locally-sourced materials.",
    category: "STEM",
    isFavorite: true
  },
  {
    id: 3,
    name: "AP Scholar with Distinction",
    organization: "College Board",
    date: "July 2022",
    level: "National",
    description: "Granted to students who receive an average score of at least 3.5 on all AP exams taken, and scores of 3 or higher on five or more of these exams.",
    category: "Academic",
    isFavorite: false
  },
  {
    id: 4,
    name: "Outstanding Community Service Award",
    organization: "City Youth Council",
    date: "June 2023",
    level: "Regional",
    description: "Recognized for completing over 200 hours of community service and developing a new volunteer program at the local homeless shelter.",
    category: "Community Service",
    isFavorite: true
  },
  {
    id: 5,
    name: "Excellence in Mathematics Award",
    organization: "Central High School",
    date: "May 2022",
    level: "School",
    description: "Awarded to the top mathematics student in the graduating class based on academic performance and participation in mathematics competitions.",
    category: "Academic",
    isFavorite: false
  },
  {
    id: 6,
    name: "Debate Tournament Champion",
    organization: "State Forensics Association",
    date: "March 2023",
    level: "State",
    description: "Won first place in Lincoln-Douglas debate at the state championship tournament, defeating 32 competitors through six elimination rounds.",
    category: "Speech & Debate",
    isFavorite: true
  },
  {
    id: 7,
    name: "Youth Leadership Award",
    organization: "Chamber of Commerce",
    date: "December 2022",
    level: "Local",
    description: "Recognized for outstanding leadership in organizing a community-wide environmental cleanup project that engaged over 50 volunteers.",
    category: "Leadership",
    isFavorite: false
  },
  {
    id: 8,
    name: "Piano Competition - First Prize",
    organization: "State Music Association",
    date: "November 2022",
    level: "State",
    description: "Awarded first prize in the advanced division for performance of Chopin's Ballade No. 1 in G minor and Debussy's Claire de Lune.",
    category: "Arts & Music",
    isFavorite: true
  },
  {
    id: 9,
    name: "Best Original Research Paper",
    organization: "National History Day Competition",
    date: "June 2023",
    level: "Regional",
    description: "Research paper on local civil rights movement history was recognized for outstanding primary source research and original analysis.",
    category: "Humanities",
    isFavorite: false
  },
  {
    id: 10,
    name: "Computer Science Excellence Award",
    organization: "National Center for Women & IT",
    date: "April 2022",
    level: "National",
    description: "Recognized for achievements in computer science and leadership in promoting diversity in technology. Included a $500 scholarship.",
    category: "STEM",
    isFavorite: true
  }
];

// Award category icons and colors for visual representation
const categoryStyles = {
  "Academic": { icon: "🎓", color: "bg-blue-100 text-blue-800 border-blue-200" },
  "STEM": { icon: "🔬", color: "bg-teal-100 text-teal-800 border-teal-200" },
  "Community Service": { icon: "🤝", color: "bg-green-100 text-green-800 border-green-200" },
  "Speech & Debate": { icon: "🎭", color: "bg-purple-100 text-purple-800 border-purple-200" },
  "Leadership": { icon: "🏆", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  "Arts & Music": { icon: "🎨", color: "bg-pink-100 text-pink-800 border-pink-200" },
  "Humanities": { icon: "📚", color: "bg-red-100 text-red-800 border-red-200" },
  "Athletics": { icon: "⚽", color: "bg-indigo-100 text-indigo-800 border-indigo-200" }
};

// Award level indicators
const levelStyles = {
  "School": { value: 1, color: "bg-gray-100 text-gray-800" },
  "Local": { value: 2, color: "bg-blue-100 text-blue-800" },
  "Regional": { value: 3, color: "bg-indigo-100 text-indigo-800" },
  "State": { value: 4, color: "bg-purple-100 text-purple-800" },
  "National": { value: 5, color: "bg-red-100 text-red-800" },
  "International": { value: 6, color: "bg-yellow-100 text-yellow-800" }
};

const AwardsDisplay = () => {
  const { user } = useAuth0();
  const [awards, setAwards] = useState(awardsData);
  const [expandedId, setExpandedId] = useState(null);
  const [savedAwards, setSavedAwards] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [activeFilter, setActiveFilter] = useState("all"); // "all", "favorites", or a category name
  const [searchTerm, setSearchTerm] = useState("");

  // Load saved awards from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('savedAwards');
    if (saved) {
      setSavedAwards(JSON.parse(saved));
    } else {
      // Set initial favorites based on awardsData
      setSavedAwards(awardsData.filter(a => a.isFavorite).map(a => a.id));
    }
  }, []);

  // Save to localStorage whenever savedAwards changes
  useEffect(() => {
    localStorage.setItem('savedAwards', JSON.stringify(savedAwards));
  }, [savedAwards]);

  // Toggle expanded state
  const toggleExpanded = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Handle toggling favorite status
  const toggleFavorite = (id, e) => {
    if (e) e.stopPropagation(); // Prevent triggering the parent onClick
    
    if (savedAwards.includes(id)) {
      // Remove from favorites
      setSavedAwards(savedAwards.filter(savedId => savedId !== id));
    } else {
      // Add to favorites
      setSavedAwards([...savedAwards, id]);
    }
  };

  // Get unique categories from awards
  const categories = [...new Set(awards.map(a => a.category))];

  // Filter awards based on active filter and search term
  const filteredAwards = awards.filter(award => {
    // Filter by category or favorites
    const passesFilter = 
      activeFilter === "all" ? true :
      activeFilter === "favorites" ? savedAwards.includes(award.id) :
      award.category === activeFilter;
    
    // Filter by search term
    const passesSearch = searchTerm === "" ? true :
      award.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      award.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      award.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return passesFilter && passesSearch;
  });

  // Sort awards by level first (highest to lowest) and then by date (most recent first)
  const sortedAwards = [...filteredAwards].sort((a, b) => {
    // Primary sort by level
    const levelValueA = levelStyles[a.level]?.value || 0;
    const levelValueB = levelStyles[b.level]?.value || 0;
    if (levelValueB !== levelValueA) {
      return levelValueB - levelValueA;
    }
    
    // Secondary sort by date (most recent first)
    // Extract year and month from date string
    const [monthA, yearA] = a.date.split(" ");
    const [monthB, yearB] = b.date.split(" ");
    
    // Compare years first
    if (yearB !== yearA) {
      return parseInt(yearB) - parseInt(yearA);
    }
    
    // If years are equal, compare months
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthIndexA = months.findIndex(m => monthA.includes(m)) !== -1 ? 
                         months.findIndex(m => monthA.includes(m)) : 
                         months.findIndex(m => m.slice(0, 3) === monthA);
    const monthIndexB = months.findIndex(m => monthB.includes(m)) !== -1 ? 
                         months.findIndex(m => monthB.includes(m)) : 
                         months.findIndex(m => m.slice(0, 3) === monthB);
    
    return monthIndexB - monthIndexA;
  });

  // Render award card
  const AwardCard = ({ award, isExpanded }) => {
    return (
      <div 
        className={`rounded-lg border p-4 transition-all duration-200 bg-white
          ${isExpanded ? 'col-span-full shadow-md' : 'hover:shadow-sm cursor-pointer'}
          ${savedAwards.includes(award.id) ? 'border-yellow-300' : 'border-gray-200'}`}
        onClick={() => toggleExpanded(award.id)}
      >
        <div className="flex justify-between items-start mb-2">
          <div className={`px-2 py-1 rounded-md text-xs flex items-center ${categoryStyles[award.category]?.color || "bg-gray-100 text-gray-800"}`}>
            <span className="mr-1">{categoryStyles[award.category]?.icon || "🏅"}</span>
            <span>{award.category}</span>
          </div>
          <button 
            onClick={(e) => toggleFavorite(award.id, e)}
            className="text-lg focus:outline-none"
            title={savedAwards.includes(award.id) ? "Remove from favorites" : "Add to favorites"}
          >
            {savedAwards.includes(award.id) ? "★" : "☆"}
          </button>
        </div>
        
        <h3 className="font-semibold text-gray-800 mb-1">{award.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{award.organization}</p>
        
        <div className="flex justify-between items-center text-xs mb-2">
          <span className={`px-2 py-0.5 rounded ${levelStyles[award.level]?.color || "bg-gray-100 text-gray-800"}`}>
            {award.level}
          </span>
          <span className="text-gray-500">{award.date}</span>
        </div>
        
        {/* Only show description if expanded */}
        {isExpanded && (
          <div className="mt-4">
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-800 mb-1">Description</h4>
              <p className="text-sm text-gray-700">{award.description}</p>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between">
              <div className="text-xs text-gray-500">
                <span className="font-medium">Category:</span> {award.category}
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpanded(award.id);
                }}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Collapse
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Tips for award presentation
  const AwardTips = () => (
    <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
      <h3 className="font-medium text-gray-800 mb-2 flex items-center">
        <span className="mr-2">💡</span>
        Tips for Award Presentation
      </h3>
      <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
        <li>Focus on showcasing <b>higher-level awards</b> (National, State) before school-level recognitions</li>
        <li>Clearly state the <b>scope and selectivity</b> of each award (e.g., "Awarded to top 1% of applicants")</li>
        <li>Include <b>context</b> that demonstrates the significance of each award</li>
        <li>For academic competitions, mention the <b>number of competitors</b> to highlight achievement level</li>
        <li>Group similar awards together on your applications for better presentation</li>
      </ul>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen overflow-hidden">
      {/* Header with filters */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-bold text-gray-800">Academic Awards & Honors</h1>
            <div className="flex items-center">
              <div className="relative mr-4">
                <input
                  type="text"
                  placeholder="Search awards..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  🔍
                </div>
              </div>
              <div className="flex bg-gray-100 p-1 rounded-md">
                <button
                  className={`px-3 py-1 text-xs rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
                  onClick={() => setViewMode('grid')}
                >
                  Grid
                </button>
                <button
                  className={`px-3 py-1 text-xs rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
                  onClick={() => setViewMode('list')}
                >
                  List
                </button>
              </div>
            </div>
          </div>
          
          {/* Category filters */}
          <div className="flex overflow-x-auto pb-4 scrollbar-hide">
            <button
              className={`mr-2 px-3 py-1 text-sm rounded-full whitespace-nowrap ${
                activeFilter === 'all' 
                  ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
              onClick={() => setActiveFilter('all')}
            >
              All Awards
            </button>
            <button
              className={`mr-2 px-3 py-1 text-sm rounded-full whitespace-nowrap flex items-center ${
                activeFilter === 'favorites' 
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' 
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
              onClick={() => setActiveFilter('favorites')}
            >
              <span className="mr-1">★</span> Favorites
            </button>
            {categories.map(category => (
              <button
                key={category}
                className={`mr-2 px-3 py-1 text-sm rounded-full whitespace-nowrap flex items-center ${
                  activeFilter === category
                    ? `${categoryStyles[category]?.color || 'bg-gray-100 text-gray-800 border-gray-200'}`
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                }`}
                onClick={() => setActiveFilter(category)}
              >
                <span className="mr-1">{categoryStyles[category]?.icon || '🏅'}</span>
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Content area */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 overflow-y-auto "style={{ height: "calc(100vh - 132px)" }}>
        {/* Tips box */}
        <AwardTips />
        
        {/* Results count */}
        <div className="mb-4 text-sm text-gray-500">
          Showing {filteredAwards.length} of {awards.length} awards
        </div>
        
        {/* Awards grid/list */}
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' 
          : 'space-y-4'
        }>
          {sortedAwards.length > 0 ? (
            sortedAwards.map(award => (
              <AwardCard 
                key={award.id} 
                award={award} 
                isExpanded={expandedId === award.id || viewMode === 'list'}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏅</span>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No awards found</h3>
              <p className="text-gray-500">Try adjusting your filters or search term</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AwardsDisplay;