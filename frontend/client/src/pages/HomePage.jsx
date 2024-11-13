import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './HomePageStyle.css';
import img from './asset/HomePageImg.png';
import axios from "axios";  // Added to make HTTP requests

const HomePage = () => {
  const [courses, setCourses] = useState([]);  // State to hold fetched courses

  // Fetch courses from the backend API when the component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('/api/courses');  // Adjust API endpoint if necessary
        setCourses(response.data);  // Store the courses in the state
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();  // Call the function to fetch courses
  }, []);  // Empty dependency array ensures the effect runs once when the component mounts

  return (
    <div className="home-page">
      <header className="header">
        <h1>Welcome to the Online Learning Platform</h1>
        <p>Empowering you to learn anywhere, anytime!</p>
      </header>
      
      <div className="image-container">
        <img
          src={img}
          alt="Online Learning"
          className="interactive-image"
        />
      </div>

      <div className="buttons">
        <Link to="/profile" className="btn profile-btn">Get Started</Link>
      </div>
    </div>
  );
};

export default HomePage;