// CollegeDetailPage.jsx - Detailed view of a single college
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const CollegeDetailPage = ({ colleges, favorites, toggleFavorite, userScores }) => {
  const { collegeId } = useParams();
  const navigate = useNavigate();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    // In a real app, you would fetch the college data from an API
    // For now, we'll just find it from the provided colleges array
    const foundCollege = colleges.find(c => c.id.toString() === collegeId);
    
    if (foundCollege) {
      setCollege(foundCollege);
      setLoading(false);
    } else {
      // College not found
      setLoading(false);
      // Redirect to not found page or home after a delay
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  }, [collegeId, colleges, navigate]);
  
  // Function to get race/ethnicity demographics data
  const getDemographicsData = (college) => {
    return [
      { name: "White", value: college["student.demographics.race_ethnicity.white"] || 0 },
      { name: "Black", value: college["student.demographics.race_ethnicity.black"] || 0 },
      { name: "Hispanic", value: college["student.demographics.race_ethnicity.hispanic"] || 0 },
      { name: "Asian", value: college["student.demographics.race_ethnicity.asian"] || 0 },
      { name: "Two or More", value: college["student.demographics.race_ethnicity.two_or_more"] || 0 },
      { name: "Non-resident Alien", value: college["student.demographics.race_ethnicity.non_resident_alien"] || 0 },
      { name: "Other", value: 
        (college["student.demographics.race_ethnicity.aian"] || 0) + 
        (college["student.demographics.race_ethnicity.nhpi"] || 0) + 
        (college["student.demographics.race_ethnicity.unknown"] || 0)
      }
    ].filter(item => item.value > 0);
  };
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!college) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="text-2xl font-bold mb-4">College Not Found</h1>
        <p className="mb-4">The college you are looking for does not exist.</p>
        <Link to="/" className="text-indigo-600 hover:underline">Return to Home</Link>
      </div>
    );
  }
  
  const isFavorite = favorites.includes(college.id);
  const raceEthnicityData = getDemographicsData(college);
  
  // Define the tabs
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'academics', label: 'Academics' },
    { id: 'admissions', label: 'Admissions' },
    { id: 'costs', label: 'Costs & Aid' },
    { id: 'demographics', label: 'Student Life' },
    { id: 'outcomes', label: 'Outcomes' }
  ];
  
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header with college name and navigation */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <Link to="/" className="text-white hover:text-gray-200">
              ← Back to All Colleges
            </Link>
            <button 
              onClick={() => toggleFavorite(college.id)}
              className="flex items-center text-white bg-white bg-opacity-20 hover:bg-opacity-30 rounded-md px-3 py-1"
            >
              <span className="mr-1">{isFavorite ? "★" : "☆"}</span>
              {isFavorite ? "Saved" : "Save"}
            </button>
          </div>
          
          <h1 className="text-3xl font-bold">{college["school.name"]}</h1>
          <div className="flex items-center mt-2">
            <span>📍</span>
            <span className="ml-1">{college["school.city"]}, {college["school.state"]} {college["school.zip"]}</span>
          </div>
        </div>
      </header>
      
      {/* Navigation Tabs */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto hide-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`py-4 px-6 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Facts */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Facts</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-gray-500 text-sm">Institution Type</p>
                  <p className="font-medium">{college["school.ownership"] === 1 ? "Public" : "Private"}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Ranking</p>
                  <p className="font-medium">#{college.ranking}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Enrollment</p>
                  <p className="font-medium">{college["student.size"].toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Acceptance Rate</p>
                  <p className="font-medium">{(college["admissions.admission_rate.overall"] * 100).toFixed(1)}%</p>
                </div>
              </div>
            </section>
            
            {/* Cost Summary */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Cost Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 text-sm">In-State Tuition</p>
                  <p className="text-2xl font-bold text-indigo-600">${college["cost.tuition.in_state"].toLocaleString()}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 text-sm">Out-of-State Tuition</p>
                  <p className="text-2xl font-bold text-indigo-600">${college["cost.tuition.out_of_state"].toLocaleString()}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 text-sm">Average Net Price</p>
                  <p className="text-2xl font-bold text-indigo-600">${college["cost.avg_net_price.overall"].toLocaleString()}</p>
                </div>
              </div>
            </section>
            
            {/* Test Scores */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Test Scores & Your Standing</h2>
              
              {/* SAT Math Visualization */}
              <div className="mb-6">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">SAT Math</span>
                  <span className="text-sm font-medium">Your Score: {userScores.sat.math}</span>
                </div>
                <div className="relative h-10 bg-gray-200 rounded-md">
                  {/* 25th percentile marker */}
                  <div 
                    className="absolute top-0 h-full w-0.5 bg-gray-500" 
                    style={{ left: `${(college["admissions.sat_scores.25th_percentile.math"] / 800) * 100}%` }}
                  >
                    <div className="absolute -top-6 -left-2 text-xs text-gray-600">
                      {college["admissions.sat_scores.25th_percentile.math"]}
                    </div>
                  </div>
                  
                  {/* 50th percentile marker */}
                  <div 
                    className="absolute top-0 h-full w-0.5 bg-gray-500" 
                    style={{ left: `${(college["admissions.sat_scores.50th_percentile.math"] / 800) * 100}%` }}
                  >
                    <div className="absolute -top-6 -left-2 text-xs text-gray-600">
                      {college["admissions.sat_scores.50th_percentile.math"]}
                    </div>
                  </div>
                  
                  {/* 75th percentile marker */}
                  <div 
                    className="absolute top-0 h-full w-0.5 bg-gray-500" 
                    style={{ left: `${(college["admissions.sat_scores.75th_percentile.math"] / 800) * 100}%` }}
                  >
                    <div className="absolute -top-6 -left-2 text-xs text-gray-600">
                      {college["admissions.sat_scores.75th_percentile.math"]}
                    </div>
                  </div>
                  
                  {/* User score marker */}
                  <div 
                    className="absolute top-0 h-full w-1 bg-blue-600" 
                    style={{ left: `${(userScores.sat.math / 800) * 100}%` }}
                  >
                    <div className="absolute -bottom-6 -left-2 text-xs font-semibold text-blue-600">
                      You
                    </div>
                  </div>
                  
                  {/* Range background */}
                  <div 
                    className="absolute top-0 h-full bg-green-200 rounded-md" 
                    style={{ 
                      left: `${(college["admissions.sat_scores.25th_percentile.math"] / 800) * 100}%`,
                      width: `${((college["admissions.sat_scores.75th_percentile.math"] - college["admissions.sat_scores.25th_percentile.math"]) / 800) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
              
              {/* SAT Reading Visualization */}
              <div className="mb-6">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">SAT Reading</span>
                  <span className="text-sm font-medium">Your Score: {userScores.sat.reading}</span>
                </div>
                <div className="relative h-10 bg-gray-200 rounded-md">
                  {/* 25th percentile marker */}
                  <div 
                    className="absolute top-0 h-full w-0.5 bg-gray-500" 
                    style={{ left: `${(college["admissions.sat_scores.25th_percentile.critical_reading"] / 800) * 100}%` }}
                  >
                    <div className="absolute -top-6 -left-2 text-xs text-gray-600">
                      {college["admissions.sat_scores.25th_percentile.critical_reading"]}
                    </div>
                  </div>
                  
                  {/* 50th percentile marker */}
                  <div 
                    className="absolute top-0 h-full w-0.5 bg-gray-500" 
                    style={{ left: `${(college["admissions.sat_scores.50th_percentile.critical_reading"] / 800) * 100}%` }}
                  >
                    <div className="absolute -top-6 -left-2 text-xs text-gray-600">
                      {college["admissions.sat_scores.50th_percentile.critical_reading"]}
                    </div>
                  </div>
                  
                  {/* 75th percentile marker */}
                  <div 
                    className="absolute top-0 h-full w-0.5 bg-gray-500" 
                    style={{ left: `${(college["admissions.sat_scores.75th_percentile.critical_reading"] / 800) * 100}%` }}
                  >
                    <div className="absolute -top-6 -left-2 text-xs text-gray-600">
                      {college["admissions.sat_scores.75th_percentile.critical_reading"]}
                    </div>
                  </div>
                  
                  {/* User score marker */}
                  <div 
                    className="absolute top-0 h-full w-1 bg-blue-600" 
                    style={{ left: `${(userScores.sat.reading / 800) * 100}%` }}
                  >
                    <div className="absolute -bottom-6 -left-2 text-xs font-semibold text-blue-600">
                      You
                    </div>
                  </div>
                  
                  {/* Range background */}
                  <div 
                    className="absolute top-0 h-full bg-green-200 rounded-md" 
                    style={{ 
                      left: `${(college["admissions.sat_scores.25th_percentile.critical_reading"] / 800) * 100}%`,
                      width: `${((college["admissions.sat_scores.75th_percentile.critical_reading"] - college["admissions.sat_scores.25th_percentile.critical_reading"]) / 800) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
              
              {/* ACT Visualization */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">ACT Composite</span>
                  <span className="text-sm font-medium">Your Score: {userScores.act}</span>
                </div>
                <div className="relative h-10 bg-gray-200 rounded-md">
                  {/* 25th percentile marker */}
                  <div 
                    className="absolute top-0 h-full w-0.5 bg-gray-500" 
                    style={{ left: `${(college["admissions.act_scores.25th_percentile.cumulative"] / 36) * 100}%` }}
                  >
                    <div className="absolute -top-6 -left-2 text-xs text-gray-600">
                      {college["admissions.act_scores.25th_percentile.cumulative"]}
                    </div>
                  </div>
                  
                  {/* 50th percentile marker */}
                  <div 
                    className="absolute top-0 h-full w-0.5 bg-gray-500" 
                    style={{ left: `${(college["admissions.act_scores.50th_percentile.cumulative"] / 36) * 100}%` }}
                  >
                    <div className="absolute -top-6 -left-2 text-xs text-gray-600">
                      {college["admissions.act_scores.50th_percentile.cumulative"]}
                    </div>
                  </div>
                  
                  {/* 75th percentile marker */}
                  <div 
                    className="absolute top-0 h-full w-0.5 bg-gray-500" 
                    style={{ left: `${(college["admissions.act_scores.75th_percentile.cumulative"] / 36) * 100}%` }}
                  >
                    <div className="absolute -top-6 -left-2 text-xs text-gray-600">
                      {college["admissions.act_scores.75th_percentile.cumulative"]}
                    </div>
                  </div>
                  
                  {/* User score marker */}
                  <div 
                    className="absolute top-0 h-full w-1 bg-blue-600" 
                    style={{ left: `${(userScores.act / 36) * 100}%` }}
                  >
                    <div className="absolute -bottom-6 -left-2 text-xs font-semibold text-blue-600">
                      You
                    </div>
                  </div>
                  
                  {/* Range background */}
                  <div 
                    className="absolute top-0 h-full bg-green-200 rounded-md" 
                    style={{ 
                      left: `${(college["admissions.act_scores.25th_percentile.cumulative"] / 36) * 100}%`,
                      width: `${((college["admissions.act_scores.75th_percentile.cumulative"] - college["admissions.act_scores.25th_percentile.cumulative"]) / 36) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            </section>
            
            {/* Earnings Potential */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Future Earnings</h2>
              <div className="mb-4">
                <p className="text-gray-500 text-sm mb-1">Median Earnings (10 years after entry)</p>
                <p className="text-3xl font-bold text-green-600">${college["earnings.10_yrs_after_entry.median"].toLocaleString()}</p>
              </div>
              
              {/* Visual indicator */}
              <div className="relative pt-5">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                  National Average: $45,000
                </div>
                <div className="h-1 w-full bg-gray-200 relative">
                  {/* National average line */}
                  <div className="absolute h-4 w-0.5 bg-gray-500 top-1/2 transform -translate-y-1/2" style={{ left: '50%' }}></div>
                  
                  {/* College marker */}
                  <div 
                    className="absolute h-4 w-4 rounded-full bg-green-500 top-1/2 transform -translate-y-1/2 -translate-x-1/2"
                    style={{ left: `${Math.min(Math.max((college["earnings.10_yrs_after_entry.median"] / 90000) * 100, 0), 100)}%` }}
                  >
                    <div className="absolute -bottom-6 transform -translate-x-1/2 text-xs font-medium text-green-600" style={{ left: '50%' }}>
                      This College
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-6">
                  <span>$30k</span>
                  <span>$45k</span>
                  <span>$60k</span>
                  <span>$75k</span>
                  <span>$90k+</span>
                </div>
              </div>
            </section>
          </div>
        )}
        
        {/* Academics Tab */}
        {activeTab === 'academics' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Academic Programs</h2>
            <p className="text-gray-600">Information about majors and academic programs would be displayed here.</p>
          </div>
        )}
        
        {/* Admissions Tab */}
        {activeTab === 'admissions' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Admissions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Admission Statistics</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-500 text-sm">Acceptance Rate</p>
                    <p className="text-xl font-bold">{(college["admissions.admission_rate.overall"] * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">SAT Range (Middle 50%)</p>
                    <p className="text-lg font-medium">
                      {college["admissions.sat_scores.25th_percentile.math"] + college["admissions.sat_scores.25th_percentile.critical_reading"]} - {college["admissions.sat_scores.75th_percentile.math"] + college["admissions.sat_scores.75th_percentile.critical_reading"]}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">ACT Range (Middle 50%)</p>
                    <p className="text-lg font-medium">
                      {college["admissions.act_scores.25th_percentile.cumulative"]} - {college["admissions.act_scores.75th_percentile.cumulative"]}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3">Your Chances</h3>
                {/* Calculator or assessment would go here */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">Based on your academic profile, you would be considered a:</p>
                  <p className="text-xl font-bold text-indigo-600 mt-2">Competitive Applicant</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Costs Tab */}
        {activeTab === 'costs' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Costs & Financial Aid</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-3">Cost Breakdown</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm">In-State Tuition & Fees</p>
                    <p className="text-xl font-bold">${college["cost.tuition.in_state"].toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm">Out-of-State Tuition & Fees</p>
                    <p className="text-xl font-bold">${college["cost.tuition.out_of_state"].toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm">Room & Board</p>
                    <p className="text-xl font-bold">${college["cost.roomboard.oncampus"].toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm">Average Net Price</p>
                    <p className="text-xl font-bold">${college["cost.avg_net_price.overall"].toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">Average cost after grants, scholarships, and financial aid</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Financial Aid</h3>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-gray-700">Financial aid information would be displayed here, including:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
                    <li>Percentage of students receiving aid</li>
                    <li>Average award amounts</li>
                    <li>Types of aid available</li>
                    <li>Scholarship opportunities</li>
                  </ul>
                </div>
                
                <h3 className="text-lg font-medium mt-6 mb-3">Net Price Calculator</h3>
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                  <p className="text-gray-700 mb-4">Get a personalized estimate of your cost to attend this institution.</p>
                  <button className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
                    Calculate Your Net Price
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Demographics Tab */}
        {activeTab === 'demographics' && (
          <div className="space-y-6">
            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Student Demographics</h2>
              
              {/* Gender Distribution */}
              <h3 className="text-lg font-medium mb-3">Gender Distribution</h3>
              <div className="flex h-10 rounded-md overflow-hidden mb-6">
                <div 
                  className="bg-blue-500 text-white flex items-center justify-center"
                  style={{ width: `${college["student.demographics.men"] * 100}%` }}
                >
                  <span className="text-sm font-medium">Men {(college["student.demographics.men"] * 100).toFixed(1)}%</span>
                </div>
                <div 
                  className="bg-pink-500 text-white flex items-center justify-center"
                  style={{ width: `${college["student.demographics.women"] * 100}%` }}
                >
                  <span className="text-sm font-medium">Women {(college["student.demographics.women"] * 100).toFixed(1)}%</span>
                </div>
              </div>
              
              {/* Race/Ethnicity */}
              <h3 className="text-lg font-medium mb-3">Race/Ethnicity</h3>
              <div className="space-y-3">
                {raceEthnicityData.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.name}</span>
                      <span className="font-medium">{(item.value * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="h-2.5 rounded-full bg-indigo-500" 
                        style={{ width: `${item.value * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Campus Life</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Housing</h3>
                  <p className="text-gray-700">Information about on-campus housing options, dormitories, meal plans, etc.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-3">Activities</h3>
                  <p className="text-gray-700">Information about student organizations, clubs, Greek life, athletics, etc.</p>
                </div>
              </div>
            </section>
          </div>
        )}
        
        {/* Outcomes Tab */}
        {activeTab === 'outcomes' && (
          <div className="space-y-6">
            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Career Outcomes</h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Earnings Potential</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-sm mb-1">Median Earnings (10 years after entry)</p>
                  <p className="text-3xl font-bold text-green-600">${college["earnings.10_yrs_after_entry.median"].toLocaleString()}</p>
                  
                  <div className="relative mt-6 pt-5">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                      National Average: $45,000
                    </div>
                    <div className="h-1 w-full bg-gray-200 relative">
                      {/* National average line */}
                      <div className="absolute h-4 w-0.5 bg-gray-500 top-1/2 transform -translate-y-1/2" style={{ left: '50%' }}></div>
                      
                      {/* College marker */}
                      <div 
                        className="absolute h-4 w-4 rounded-full bg-green-500 top-1/2 transform -translate-y-1/2 -translate-x-1/2"
                        style={{ left: `${Math.min(Math.max((college["earnings.10_yrs_after_entry.median"] / 90000) * 100, 0), 100)}%` }}
                      >
                        <div className="absolute -bottom-6 transform -translate-x-1/2 text-xs font-medium text-green-600" style={{ left: '50%' }}>
                          This College
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-6">
                      <span>$30k</span>
                      <span>$45k</span>
                      <span>$60k</span>
                      <span>$75k</span>
                      <span>$90k+</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Top Employers</h3>
                  <p className="text-gray-700">Information about companies that hire graduates would appear here.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-3">Graduate Schools</h3>
                  <p className="text-gray-700">Information about graduate school attendance and programs would appear here.</p>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
      
      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md py-3 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <a 
            href={`https://${college["school.school_url"]}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
          >
            <span className="mr-1">🌐</span>
            Visit Official Website
          </a>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition">
              Add to Comparison
            </button>
            <button 
              onClick={() => toggleFavorite(college.id)}
              className={`px-4 py-2 rounded-md ${
                isFavorite 
                  ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isFavorite ? 'Saved to Favorites' : 'Save to Favorites'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeDetailPage;