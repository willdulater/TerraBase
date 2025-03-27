


// Additional notes for future development:
// 1. Implement more sophisticated admission chance calculation
// 2. Add machine learning-based recommendations
// 3. Create more detailed profile creation options
// 4. Integrate with external college databases
// 5. Add feature to save and track application progressimport React, { useState, useEffect, useMemo } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from 'react';

// Sample college data with additional fields for personalization
const collegeData = [
  {
    id: 1,
    name: "Harvard University",
    location: "Cambridge, MA",
    type: "Private",
    admissionStats: {
      medianSAT: 1540,
      medianACT: 35,
      medianGPA: 4.18,
      acceptanceRate: 4.0
    },
    applicationOptions: {
      earlyAction: true,
      earlyDecision: true,
      regularDecision: true
    },
    financialAid: {
      averageAnnualAid: 55000,
      meetFullNeed: true
    },
    majorSpecificStats: {
      computerScience: {
        acceptanceRate: 3.5,
        averageGPA: 4.2,
        averageSAT: 1550
      }
    }
  },
  {
    id: 2,
    name: "Stanford University",
    location: "Stanford, CA",
    type: "Private",
    admissionStats: {
      medianSAT: 1530,
      medianACT: 34,
      medianGPA: 4.15,
      acceptanceRate: 3.9
    },
    applicationOptions: {
      earlyAction: false,
      earlyDecision: true,
      regularDecision: true
    },
    financialAid: {
      averageAnnualAid: 52000,
      meetFullNeed: true
    },
    majorSpecificStats: {
      computerScience: {
        acceptanceRate: 3.2,
        averageGPA: 4.1,
        averageSAT: 1540
      }
    }
  },
  // Add more colleges...
];

// Utility function to calculate admission chances
const calculateAdmissionChances = (studentProfile, collegeProfile) => {
  const { sat, act, gpa, desiredMajor } = studentProfile;
  const { admissionStats, majorSpecificStats } = collegeProfile;
  
  // Compare student stats to college median
  const satDiff = sat - admissionStats.medianSAT;
  const actDiff = act - admissionStats.medianACT;
  const gpaDiff = gpa - admissionStats.medianGPA;
  
  // Calculate base score
  let baseScore = 0;
  if (satDiff >= 0) baseScore += 40;
  else if (satDiff > -100) baseScore += 20;
  
  if (actDiff >= 0) baseScore += 30;
  else if (actDiff > -5) baseScore += 15;
  
  if (gpaDiff >= 0) baseScore += 30;
  else if (gpaDiff > -0.5) baseScore += 15;
  
  // Major-specific adjustments
  if (desiredMajor && majorSpecificStats[desiredMajor]) {
    const majorStats = majorSpecificStats[desiredMajor];
    const majorSatDiff = sat - majorStats.averageSAT;
    const majorGpaDiff = gpa - majorStats.averageGPA;
    
    if (majorSatDiff >= 0) baseScore += 20;
    else if (majorSatDiff > -50) baseScore += 10;
    
    if (majorGpaDiff >= 0) baseScore += 20;
    else if (majorGpaDiff > -0.3) baseScore += 10;
  }
  
  // Determine admission category
  let admissionCategory = 'Reach';
  if (baseScore > 80) admissionCategory = 'Match';
  if (baseScore > 100) admissionCategory = 'Safety';
  
  return {
    score: baseScore,
    category: admissionCategory
  };
};

const YourColleges = () => {
  const { user } = useAuth0();
  
  // Student profile state
  const [studentProfile, setStudentProfile] = useState({
    sat: 1400,
    act: 32,
    gpa: 3.8,
    desiredMajor: 'computerScience',
    interests: [],
    financialNeed: 0,
    extracurriculars: [],
    ethnicity: '',
    firstGeneration: false
  });
  
  // Personalization settings
  const [personalizeSettings, setPersonalizeSettings] = useState({
    considerFinancialAid: true,
    prioritizeDiversity: false,
    includeResearchOpportunities: true
  });
  
  // Colleges with personalized analysis
  const personalizedColleges = useMemo(() => {
    return collegeData.map(college => {
      const admissionAnalysis = calculateAdmissionChances(studentProfile, college);
      
      return {
        ...college,
        personalizedAnalysis: {
          admissionChances: admissionAnalysis.score,
          admissionCategory: admissionAnalysis.category,
          financialFit: college.financialAid.averageAnnualAid <= studentProfile.financialNeed 
            ? 'Excellent' 
            : 'Needs Further Investigation'
        }
      };
    }).sort((a, b) => 
      b.personalizedAnalysis.admissionChances - a.personalizedAnalysis.admissionChances
    );
  }, [studentProfile]);

  // Render college recommendation card
  const CollegeRecommendationCard = ({ college }) => {
    const { personalizedAnalysis } = college;
    
    // Determine admission chance color
    const getAdmissionChanceColor = (category) => {
      switch(category) {
        case 'Safety': return 'bg-green-100 text-green-800';
        case 'Match': return 'bg-blue-100 text-blue-800';
        case 'Reach': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{college.name}</h3>
            <p className="text-gray-600">{college.location}</p>
          </div>
          
          <div 
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              getAdmissionChanceColor(personalizedAnalysis.admissionCategory)
            }`}
          >
            {personalizedAnalysis.admissionCategory}
          </div>
        </div>
        
        <div className="mt-4 grid md:grid-cols-3 gap-4">
          {/* Admission Statistics */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="text-xs text-gray-500 mb-1">Admission Stats</h4>
            <div className="space-y-1">
              <p className="text-sm">
                <span className="font-medium">Median SAT:</span> {college.admissionStats.medianSAT}
              </p>
              <p className="text-sm">
                <span className="font-medium">Acceptance Rate:</span> {college.admissionStats.acceptanceRate}%
              </p>
            </div>
          </div>
          
          {/* Personalized Chances */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="text-xs text-gray-500 mb-1">Your Chances</h4>
            <div className="space-y-1">
              <p className="text-sm">
                <span className="font-medium">Admission Score:</span> {personalizedAnalysis.admissionChances.toFixed(0)}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="h-2 rounded-full bg-blue-500"
                  style={{ 
                    width: `${Math.min(personalizedAnalysis.admissionChances, 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Application Options */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="text-xs text-gray-500 mb-1">Application Options</h4>
            <div className="space-y-1">
              {college.applicationOptions.earlyDecision && (
                <p className="text-sm text-gray-700">Early Decision Available</p>
              )}
              {college.applicationOptions.earlyAction && (
                <p className="text-sm text-gray-700">Early Action Available</p>
              )}
              {college.applicationOptions.regularDecision && (
                <p className="text-sm text-gray-700">Regular Decision Available</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Financial Fit */}
        <div className="mt-4 bg-blue-50 p-3 rounded-lg">
          <h4 className="text-xs text-gray-500 mb-1">Financial Fit</h4>
          <p className="text-sm">
            <span className="font-medium">Average Annual Aid:</span> ${college.financialAid.averageAnnualAid.toLocaleString()}
          </p>
          <p className={`font-semibold ${
            personalizedAnalysis.financialFit === 'Excellent' 
              ? 'text-green-600' 
              : 'text-yellow-600'
          }`}>
            {personalizedAnalysis.financialFit}
          </p>
        </div>
      </div>
    );
  };

  // Student Profile Editor
  const StudentProfileEditor = () => {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Profile</h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          {/* Standardized Test Scores */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Test Scores</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">SAT Score</label>
                <input 
                  type="number"
                  value={studentProfile.sat}
                  onChange={(e) => setStudentProfile(prev => ({
                    ...prev, 
                    sat: parseInt(e.target.value) || 0
                  }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  min="400"
                  max="1600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ACT Score</label>
                <input 
                  type="number"
                  value={studentProfile.act}
                  onChange={(e) => setStudentProfile(prev => ({
                    ...prev, 
                    act: parseInt(e.target.value) || 0
                  }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  min="1"
                  max="36"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">GPA</label>
                <input 
                  type="number"
                  step="0.1"
                  value={studentProfile.gpa}
                  onChange={(e) => setStudentProfile(prev => ({
                    ...prev, 
                    gpa: parseFloat(e.target.value) || 0
                  }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  min="0"
                  max="5"
                />
              </div>
            </div>
          </div>
          
          {/* Major and Interests */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Academic Interests</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Desired Major</label>
                <select
                  value={studentProfile.desiredMajor}
                  onChange={(e) => setStudentProfile(prev => ({
                    ...prev, 
                    desiredMajor: e.target.value
                  }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
                  <option value="computerScience">Computer Science</option>
                  <option value="engineering">Engineering</option>
                  <option value="biology">Biology</option>
                  <option value="economics">Economics</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Financial Need</label>
                <input 
                  type="number"
                  value={studentProfile.financialNeed}
                  onChange={(e) => setStudentProfile(prev => ({
                    ...prev, 
                    financialNeed: parseInt(e.target.value) || 0
                  }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  min="0"
                />
              </div>
            </div>
          </div>
          
          {/* Personalization Settings */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Personalization</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <input 
                  type="checkbox"
                  checked={personalizeSettings.considerFinancialAid}
                  onChange={() => setPersonalizeSettings(prev => ({
                    ...prev,
                    considerFinancialAid: !prev.considerFinancialAid
                  }))}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">Consider Financial Aid</label>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox"
                  checked={personalizeSettings.prioritizeDiversity}
                  onChange={() => setPersonalizeSettings(prev => ({
                    ...prev,
                    prioritizeDiversity: !prev.prioritizeDiversity
                  }))}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">Prioritize Diversity</label>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox"
                  checked={personalizeSettings.includeResearchOpportunities}
                  onChange={() => setPersonalizeSettings(prev => ({
                    ...prev,
                    includeResearchOpportunities: !prev.includeResearchOpportunities
                  }))}
                  className="mr-2"
/>
                <label className="text-sm text-gray-700">Include Research Opportunities</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main render method
  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Personalized College Finder</h1>
        <p className="text-gray-600 mt-2">
          Discover colleges that match your academic profile and personal goals
        </p>
      </header>

      {/* Student Profile Editor */}
      <StudentProfileEditor />

      {/* Recommendations Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Your College Recommendations</h2>
          <div className="flex space-x-2">
            {/* Sorting and Filtering Options */}
            <select 
              className="p-2 border rounded-md text-sm"
              onChange={(e) => {
                // Implement sorting logic
                const sortOption = e.target.value;
                // You would add sorting implementation here
              }}
            >
              <option value="admissionChances">Best Admission Chances</option>
              <option value="financialFit">Financial Fit</option>
              <option value="location">Location</option>
            </select>
          </div>
        </div>

        {/* Recommendations Grid */}
        <div className="space-y-4">
          {personalizedColleges.map(college => (
            <CollegeRecommendationCard 
              key={college.id} 
              college={college} 
            />
          ))}
        </div>
      </section>

      {/* Additional Insights Section */}
      <section className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Additional Insights</h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          {/* Application Strategy */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Application Strategy</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
              <li>Aim for a balanced college list</li>
              <li>Consider Early Decision/Action options</li>
              <li>Prepare strong supplemental essays</li>
            </ul>
          </div>

          {/* Financial Aid Tips */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Financial Aid Advice</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
              <li>Complete FAFSA early</li>
              <li>Apply for scholarships</li>
              <li>Compare financial aid packages</li>
            </ul>
          </div>

          {/* Profile Strengths */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Your Profile Strengths</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                <span className="text-sm text-gray-700">
                  Strong GPA: {studentProfile.gpa} / 4.0
                </span>
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-green-500">✓</span>
                <span className="text-sm text-gray-700">
                  Competitive SAT Score: {studentProfile.sat}
                </span>
              </div>
              {/* You could add more dynamic strengths based on profile */}
            </div>
          </div>
        </div>
      </section>

      {/* Application Timeline */}
      <section className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Application Timeline</h2>
        
        <div className="relative pl-8 border-l-4 border-blue-500">
          {/* Timeline Items */}
          <div className="mb-4 relative">
            <div className="absolute -left-[34px] w-6 h-6 bg-blue-500 rounded-full mt-1"></div>
            <h3 className="text-lg font-semibold text-gray-800">Junior Year</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>Take SAT/ACT</li>
              <li>Research colleges</li>
              <li>Begin drafting college list</li>
            </ul>
          </div>

          <div className="mb-4 relative">
            <div className="absolute -left-[34px] w-6 h-6 bg-blue-500 rounded-full mt-1"></div>
            <h3 className="text-lg font-semibold text-gray-800">Senior Year Fall</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>Finalize college list</li>
              <li>Complete applications</li>
              <li>Write supplemental essays</li>
            </ul>
          </div>

          <div className="relative">
            <div className="absolute -left-[34px] w-6 h-6 bg-blue-500 rounded-full mt-1"></div>
            <h3 className="text-lg font-semibold text-gray-800">Senior Year Winter</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>Submit financial aid forms</li>
              <li>Prepare for interviews</li>
              <li>Wait for decisions</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default YourColleges;