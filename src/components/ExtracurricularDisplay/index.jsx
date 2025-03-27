import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { motion } from "framer-motion";

// Sample extracurricular data
// In a real implementation, this would come from your backend
const extracurricularData = [
  {
    id: 1,
    name: "Robotics Club",
    position: "Team Captain",
    organization: "Central High School",
    description: "Led a team of 12 students in designing and building competitive robots. Organized weekly meetings and coordinated participation in regional competitions.",
    duration: "Sep 2021 - May 2023",
    hoursPerWeek: 6,
    category: "STEM",
    impactLevel: "Regional",
    achievements: [
      "3rd place in State Robotics Championship",
      "Mentored 5 junior team members",
      "Secured $2,000 in funding through grant writing"
    ],
    skills: ["Leadership", "Technical Design", "Programming", "Teamwork"],
    isFavorite: true
  },
  {
    id: 2,
    name: "Community Food Bank",
    position: "Volunteer Coordinator",
    organization: "Helping Hands Nonprofit",
    description: "Coordinated volunteer schedules and managed food distribution events. Recruited new volunteers through social media campaigns.",
    duration: "Mar 2022 - Jun 2023",
    hoursPerWeek: 4,
    category: "Community Service",
    impactLevel: "Local",
    achievements: [
      "Organized distribution of 10,000+ meals",
      "Increased volunteer participation by 30%",
      "Created digital inventory system"
    ],
    skills: ["Volunteer Management", "Communication", "Organization", "Social Media"],
    isFavorite: false
  },
  {
    id: 3,
    name: "Debate Team",
    position: "Varsity Debater",
    organization: "Central High School",
    description: "Participated in Lincoln-Douglas debate format competitions. Researched current events and developed persuasive arguments on policy topics.",
    duration: "Sep 2020 - May 2023",
    hoursPerWeek: 5,
    category: "Academic",
    impactLevel: "State",
    achievements: [
      "2nd place at State Debate Championship",
      "Qualified for Nationals twice",
      "Trained 8 novice debaters"
    ],
    skills: ["Public Speaking", "Research", "Argumentation", "Critical Thinking"],
    isFavorite: true
  },
  {
    id: 4,
    name: "Internship - Software Development",
    position: "Junior Developer Intern",
    organization: "TechStart Inc.",
    description: "Worked on front-end development for client projects. Participated in agile development cycles and collaborated with senior developers.",
    duration: "Jun 2022 - Aug 2022",
    hoursPerWeek: 20,
    category: "Career-Oriented",
    impactLevel: "Local",
    achievements: [
      "Developed 3 responsive web applications",
      "Created an internal tool that improved workflow efficiency",
      "Learned React.js framework and contributed to production code"
    ],
    skills: ["JavaScript", "React", "HTML/CSS", "Git", "Agile Methodology"],
    isFavorite: true
  },
  {
    id: 5,
    name: "Student Government",
    position: "Class Treasurer",
    organization: "Central High School",
    description: "Managed class budget and fundraising initiatives. Collaborated with other student leaders to plan school events and address student concerns.",
    duration: "Sep 2021 - May 2022",
    hoursPerWeek: 3,
    category: "Leadership",
    impactLevel: "School",
    achievements: [
      "Raised $5,000 for senior class activities",
      "Implemented transparent budget reporting system",
      "Co-organized annual school carnival"
    ],
    skills: ["Budgeting", "Event Planning", "Communication", "Leadership"],
    isFavorite: false
  },
  {
    id: 6,
    name: "Science Olympiad",
    position: "Team Member",
    organization: "Central High School",
    description: "Competed in physics and engineering events. Prepared and studied for competitions in various scientific disciplines.",
    duration: "Sep 2020 - May 2022",
    hoursPerWeek: 4,
    category: "STEM",
    impactLevel: "State",
    achievements: [
      "Gold medal in Bridge Building competition",
      "Silver medal in Circuit Lab event",
      "Team placed 5th overall at State competition"
    ],
    skills: ["Physics", "Engineering", "Problem Solving", "Teamwork"],
    isFavorite: true
  },
  {
    id: 7,
    name: "Environmental Club",
    position: "Founding Member",
    organization: "Central High School",
    description: "Started a school-wide recycling program and organized environmental awareness campaigns. Led monthly clean-up events in local parks.",
    duration: "Jan 2021 - May 2023",
    hoursPerWeek: 2,
    category: "Environmental",
    impactLevel: "Local",
    achievements: [
      "Implemented school-wide recycling program",
      "Organized 12 park clean-up events",
      "Reduced school waste by estimated 30%"
    ],
    skills: ["Project Management", "Environmental Awareness", "Public Speaking", "Organization"],
    isFavorite: false
  },
  {
    id: 8,
    name: "Summer Research Program",
    position: "Student Researcher",
    organization: "State University Biology Department",
    description: "Participated in supervised research on plant genetics. Conducted experiments, collected data, and contributed to research findings.",
    duration: "Jun 2022 - Aug 2022",
    hoursPerWeek: 30,
    category: "Research",
    impactLevel: "State",
    achievements: [
      "Co-authored research paper submitted to science journal",
      "Developed lab techniques in DNA extraction",
      "Presented findings at student research symposium"
    ],
    skills: ["Laboratory Techniques", "Data Analysis", "Scientific Writing", "Research Methodology"],
    isFavorite: true
  }
];

// Category icons and colors for visual representation
const categoryStyles = {
  "STEM": { icon: "🔬", color: "bg-blue-100 text-blue-800 border-blue-200" },
  "Community Service": { icon: "🤝", color: "bg-green-100 text-green-800 border-green-200" },
  "Academic": { icon: "📚", color: "bg-purple-100 text-purple-800 border-purple-200" },
  "Career-Oriented": { icon: "💼", color: "bg-gray-100 text-gray-800 border-gray-300" },
  "Leadership": { icon: "🏆", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  "Environmental": { icon: "🌱", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  "Research": { icon: "🔎", color: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  "Arts & Music": { icon: "🎨", color: "bg-pink-100 text-pink-800 border-pink-200" },
  "Athletics": { icon: "⚽", color: "bg-red-100 text-red-800 border-red-200" }
};

// Impact level indicators
const impactLevels = {
  "School": { value: 1, color: "bg-gray-100 text-gray-800" },
  "Local": { value: 2, color: "bg-blue-100 text-blue-800" },
  "Regional": { value: 3, color: "bg-indigo-100 text-indigo-800" },
  "State": { value: 4, color: "bg-purple-100 text-purple-800" },
  "National": { value: 5, color: "bg-red-100 text-red-800" },
  "International": { value: 6, color: "bg-yellow-100 text-yellow-800" }
};

const ExtracurricularGridDisplay = () => {
  const { user } = useAuth0();
  const [activities, setActivities] = useState(extracurricularData);
  const [expandedId, setExpandedId] = useState(null);
  const [savedActivities, setSavedActivities] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [activeFilter, setActiveFilter] = useState("all"); // "all", "favorites", or a category name
  const [searchTerm, setSearchTerm] = useState("");

  // Load saved activities from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('savedActivities');
    if (saved) {
      setSavedActivities(JSON.parse(saved));
    } else {
      // Set initial favorites based on extracurricularData
      setSavedActivities(extracurricularData.filter(a => a.isFavorite).map(a => a.id));
    }
  }, []);

  // Save to localStorage whenever savedActivities changes
  useEffect(() => {
    localStorage.setItem('savedActivities', JSON.stringify(savedActivities));
  }, [savedActivities]);

  // Toggle expanded state
  const toggleExpanded = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Handle toggling favorite status
  const toggleFavorite = (id, e) => {
    if (e) e.stopPropagation(); // Prevent triggering the parent onClick
    
    if (savedActivities.includes(id)) {
      // Remove from favorites
      setSavedActivities(savedActivities.filter(savedId => savedId !== id));
    } else {
      // Add to favorites
      setSavedActivities([...savedActivities, id]);
    }
  };

  // Get unique categories from activities
  const categories = [...new Set(activities.map(a => a.category))];

  // Filter activities based on active filter and search term
  const filteredActivities = activities.filter(activity => {
    // Filter by category or favorites
    const passesFilter = 
      activeFilter === "all" ? true :
      activeFilter === "favorites" ? savedActivities.includes(activity.id) :
      activity.category === activeFilter;
    
    // Filter by search term
    const passesSearch = searchTerm === "" ? true :
      activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return passesFilter && passesSearch;
  });

  // Render activity card
  const ActivityCard = ({ activity, isExpanded }) => {
    return (
      <div 
        className={`rounded-lg border p-4 transition-all duration-200 bg-white
          ${isExpanded ? 'col-span-full shadow-md' : 'hover:shadow-sm cursor-pointer'}
          ${savedActivities.includes(activity.id) ? 'border-yellow-300' : 'border-gray-200'}`}
        onClick={() => toggleExpanded(activity.id)}
      >
        <div className="flex justify-between items-start mb-2">
          <div className={`px-2 py-1 rounded-md text-xs flex items-center ${categoryStyles[activity.category]?.color || "bg-gray-100 text-gray-800"}`}>
            <span className="mr-1">{categoryStyles[activity.category]?.icon || "📋"}</span>
            <span>{activity.category}</span>
          </div>
          <button 
            onClick={(e) => toggleFavorite(activity.id, e)}
            className="text-lg focus:outline-none"
            title={savedActivities.includes(activity.id) ? "Remove from favorites" : "Add to favorites"}
          >
            {savedActivities.includes(activity.id) ? "★" : "☆"}
          </button>
        </div>
        
        <h3 className="font-semibold text-gray-800 mb-1">{activity.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{activity.position} • {activity.organization}</p>
        
        <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
          <span>{activity.duration}</span>
          <span>{activity.hoursPerWeek} hrs/week</span>
        </div>
        
        {/* Only show these sections if expanded */}
        {isExpanded && (
          <div className="mt-4">
            <div className="mb-4">
              <p className="text-sm text-gray-700">{activity.description}</p>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <span className="mr-2 text-gray-700">🏆</span>
                <h4 className="text-sm font-medium text-gray-800">Key Achievements</h4>
              </div>
              <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
                {activity.achievements.map((achievement, index) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <span className="mr-2 text-gray-700">💡</span>
                <h4 className="text-sm font-medium text-gray-800">Skills Developed</h4>
              </div>
              <div className="flex flex-wrap gap-1">
                {activity.skills.map((skill, index) => (
                  <span key={index} className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between">
              <div className="flex items-center">
                <span className="text-xs font-medium text-gray-500 mr-2">Impact:</span>
                <span className={`text-xs px-2 py-0.5 rounded ${impactLevels[activity.impactLevel]?.color || "bg-gray-100 text-gray-800"}`}>
                  {activity.impactLevel}
                </span>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpanded(activity.id);
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

  return (
    <div className="bg-gray-50 min-h-screen overflow-hidden">
      {/* Header with filters */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-bold text-gray-800">Extracurricular Activities</h1>
            <div className="flex items-center">
              <div className="relative mr-4">
                <input
                  type="text"
                  placeholder="Search activities..."
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
              All Activities
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
                <span className="mr-1">{categoryStyles[category]?.icon || '📋'}</span>
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Content area */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 overflow-y-auto "style={{ height: "calc(100vh - 132px)" }} >
        {/* Results count */}
        <div className="mb-4 text-sm text-gray-500">
          Showing {filteredActivities.length} of {activities.length} activities
        </div>
        
        {/* Activities grid/list */}
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' 
          : 'space-y-4'
        }>
          {filteredActivities.length > 0 ? (
            filteredActivities.map(activity => (
              <ActivityCard 
                key={activity.id} 
                activity={activity} 
                isExpanded={expandedId === activity.id || viewMode === 'list'}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No activities found</h3>
              <p className="text-gray-500">Try adjusting your filters or search term</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExtracurricularGridDisplay;