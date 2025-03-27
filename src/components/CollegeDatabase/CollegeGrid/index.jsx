// CollegeGrid.jsx - Main grid view of colleges
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CollegeGrid = ({ colleges, favorites, toggleFavorite }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter colleges based on search term
  const filteredColleges = colleges.filter(college => 
    searchTerm === "" || 
    college["school.name"].toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${college["school.city"]}, ${college["school.state"]}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <h1 className="text-2xl font-bold text-indigo-700">College Explorer</h1>
            
            {/* Search Bar */}
            <div className="w-full md:w-1/2 relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search for colleges by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Results Stats */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {filteredColleges.length} {filteredColleges.length === 1 ? 'College' : 'Colleges'} Found
          </h2>
          <div className="text-sm text-gray-600">
            {favorites.length} {favorites.length === 1 ? 'favorite' : 'favorites'}
          </div>
        </div>
        
        {/* Colleges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredColleges.map(college => (
            <SimpleCollegeCard 
              key={college.id} 
              college={college} 
              isFavorite={favorites.includes(college.id)}
              toggleFavorite={toggleFavorite} 
            />
          ))}
        </div>
        
        {/* Empty State */}
        {filteredColleges.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No colleges found matching your search criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
};

// Simple college card for the grid view
const SimpleCollegeCard = ({ college, isFavorite, toggleFavorite }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4">
      <div className="flex justify-between items-start mb-2">
        <Link to={`/college/${college.id}`} className="font-semibold text-lg text-gray-800 pr-4 hover:text-indigo-600">
          {college["school.name"]}
        </Link>
        <button 
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(college.id);
          }}
          className="text-xl text-yellow-500 hover:text-yellow-600"
        >
          {isFavorite ? "★" : "☆"}
        </button>
      </div>
      
      <div className="flex items-center text-sm text-gray-600 mb-3">
        <span>📍</span>
        <span className="ml-1">{college["school.city"]}, {college["school.state"]}</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-gray-50 p-2 rounded-md">
          <p className="text-xs text-gray-500">Acceptance</p>
          <p className="font-medium">{(college["admissions.admission_rate.overall"] * 100).toFixed(1)}%</p>
        </div>
        <div className="bg-gray-50 p-2 rounded-md">
          <p className="text-xs text-gray-500">Type</p>
          <p className="font-medium">{college["school.ownership"] === 1 ? "Public" : "Private"}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gray-50 p-2 rounded-md">
          <p className="text-xs text-gray-500">In-State Tuition</p>
          <p className="font-medium">${(college["cost.tuition.in_state"] / 1000).toFixed(1)}k</p>
        </div>
        <div className="bg-gray-50 p-2 rounded-md">
          <p className="text-xs text-gray-500">Rank</p>
          <p className="font-medium">#{college.ranking}</p>
        </div>
      </div>
      
      <Link 
        to={`/college/${college.id}`}
        className="block w-full mt-4 py-2 text-center text-sm bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition"
      >
        View Details
      </Link>
    </div>
  );
};

export default CollegeGrid;