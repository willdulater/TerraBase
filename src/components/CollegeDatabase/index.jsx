import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Search, Filter, MapPin, DollarSign, BarChart2, Award, Users, PieChart, BookOpen } from 'lucide-react';
import CollegeGrid from './CollegeGrid';
import CollegeDetailPage from './CollegeDetailsPage';
// Sample college data
const sampleColleges = [
  {
    id: 100654,
    "school.name": "Alabama A & M University",
    "school.city": "Normal",
    "school.state": "AL",
    "school.zip": "35762",
    "school.school_url": "www.aamu.edu/",
    "school.ownership": 1, // 1 = Public
    "admissions.admission_rate.overall": 0.684,
    "admissions.sat_scores.average.overall": 920,
    "admissions.sat_scores.midpoint.math": 460,
    "admissions.sat_scores.midpoint.critical_reading": 475,
    "admissions.act_scores.midpoint.cumulative": 18,
    "cost.tuition.in_state": 10024,
    "cost.tuition.out_of_state": 18634,
    "cost.roomboard.oncampus": 9520,
    "cost.avg_net_price.overall": 14982,
    "student.size": 5196,
    "student.demographics.men": 0.4055,
    "student.demographics.women": 0.5945,
    "earnings.10_yrs_after_entry.median": 40628,
    "ranking": 200,
    matchScore: 68,
    isFavorite: false,
    applicationStatus: "Considering"
  },
  {
    
    id: 100663,
    "school.name": "University of Alabama at Birmingham",
    "school.city": "Birmingham",
    "school.state": "AL",
    "school.zip": "35294",
    "school.school_url": "www.uab.edu/",
    "school.ownership": 1, // 1 = Public
    "admissions.admission_rate.overall": 0.74,
    "admissions.sat_scores.average.overall": 1170,
    "admissions.sat_scores.midpoint.math": 590,
    "admissions.sat_scores.midpoint.critical_reading": 580,
    "admissions.act_scores.midpoint.cumulative": 24,
    "cost.tuition.in_state": 8568,
    "cost.tuition.out_of_state": 19968,
    "cost.roomboard.oncampus": 10000,
    "cost.avg_net_price.overall": 16822,
    "student.size": 13878,
    "student.demographics.men": 0.41,
    "student.demographics.women": 0.59,
    "earnings.10_yrs_after_entry.median": 45000,
    "ranking": 153,
    matchScore: 85,
    isFavorite: true,
    applicationStatus: "Dream School",
  },
  {
    id: 100706,
    "school.name": "University of Alabama in Huntsville",
    "school.city": "Huntsville",
    "school.state": "AL",
    "school.zip": "35899",
    "school.school_url": "www.uah.edu/",
    "school.ownership": 1, // 1 = Public
    "admissions.admission_rate.overall": 0.82,
    "admissions.sat_scores.average.overall": 1250,
    "admissions.sat_scores.midpoint.math": 640,
    "admissions.sat_scores.midpoint.critical_reading": 610,
    "admissions.act_scores.midpoint.cumulative": 28,
    "cost.tuition.in_state": 9730,
    "cost.tuition.out_of_state": 22126,
    "cost.roomboard.oncampus": 9350,
    "cost.avg_net_price.overall": 14600,
    "student.size": 6000,
    "student.demographics.men": 0.52,
    "student.demographics.women": 0.48,
    "earnings.10_yrs_after_entry.median": 56000,
    "ranking": 136,
    matchScore: 92,
    isFavorite: true,
    applicationStatus: "Applying"
  },
  {
    id: 100751,
    "school.name": "University of Arizona",
    "school.city": "Tucson",
    "school.state": "AZ",
    "school.zip": "85721",
    "school.school_url": "www.arizona.edu/",
    "school.ownership": 1, // 1 = Public
    "admissions.admission_rate.overall": 0.85,
    "admissions.sat_scores.average.overall": 1235,
    "admissions.sat_scores.midpoint.math": 620,
    "admissions.sat_scores.midpoint.critical_reading": 615,
    "admissions.act_scores.midpoint.cumulative": 25,
    "cost.tuition.in_state": 12400,
    "cost.tuition.out_of_state": 36400,
    "cost.roomboard.oncampus": 13050,
    "cost.avg_net_price.overall": 15758,
    "student.size": 35000,
    "student.demographics.men": 0.46,
    "student.demographics.women": 0.54,
    "earnings.10_yrs_after_entry.median": 47800,
    "ranking": 97,
    matchScore: 77,
    isFavorite: false,
    applicationStatus: "Considering"
  },
  {
    id: 100858,
    "school.name": "Harvard University",
    "school.city": "Cambridge",
    "school.state": "MA",
    "school.zip": "02138",
    "school.school_url": "www.harvard.edu/",
    "school.ownership": 2, // 2 = Private
    "admissions.admission_rate.overall": 0.04,
    "admissions.sat_scores.average.overall": 1520,
    "admissions.sat_scores.midpoint.math": 770,
    "admissions.sat_scores.midpoint.critical_reading": 750,
    "admissions.act_scores.midpoint.cumulative": 34,
    "cost.tuition.in_state": 51925,
    "cost.tuition.out_of_state": 51925,
    "cost.roomboard.oncampus": 18450,
    "cost.avg_net_price.overall": 18277,
    "student.size": 6700,
    "student.demographics.men": 0.51,
    "student.demographics.women": 0.49,
    "earnings.10_yrs_after_entry.median": 95500,
    "ranking": 2,
    matchScore: 45,
    isFavorite: false,
    applicationStatus: "Dream School"
  }
];

const userScores = {
  sat: {
    math: 650,
    reading: 620
  },
  act: 28
};
  
const CollegeDatabase = () => {
  const [colleges, setColleges] = useState(sampleColleges);
  const [favorites, setFavorites] = useState([]);
  
  // Toggle favorite status for a college
  const toggleFavorite = (id) => {
    setFavorites(prevFavorites => 
      prevFavorites.includes(id) 
        ? prevFavorites.filter(favId => favId !== id) 
        : [...prevFavorites, id]
    );
  };
  
  return (
    <>
            <CollegeGrid 
              colleges={colleges} 
              favorites={favorites} 
              toggleFavorite={toggleFavorite} 
            />
     
            <CollegeDetailPage 
              colleges={colleges} 
              favorites={favorites} 
              toggleFavorite={toggleFavorite}
              userScores={userScores}
            />
      </>
    
  );
};


export default CollegeDatabase;