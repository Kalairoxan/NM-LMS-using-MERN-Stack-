import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './CoursePage.css';

// Utility function to extract YouTube video ID from the URL
const getVideoIdFromUrl = (url) => {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/\S+\/|\S+\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null); // State to track selected course

  useEffect(() => {
    // Fetch courses from the backend API
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/courses');
        setCourses(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching courses');
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Handle course enrollment
  const handleEnroll = async (courseId, videoUrl) => {
    setSelectedCourseId(courseId); // Set the selected course ID
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/courses/enroll/${courseId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data.message); // Success message
    } catch (error) {
      console.error('Error enrolling in course:', error);
      alert('Failed to enroll in course');
    }
  };

  // Handle course purchase
  const handlePurchase = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/courses/purchase/${courseId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data.message); // Success or redirect to payment page
    } catch (error) {
      console.error('Error purchasing course:', error);
      alert('Failed to purchase course');
    }
  };

  if (loading) {
    return <p>Loading courses...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="course-page">
      {/* Header and Profile Button */}
      <div className="course-header">
        <h2>Available Courses</h2>
        <Link to="/profile" className="profile-btn">Profile</Link>
      </div>

      <div className="course-list">
        {courses.map(course => (
          <div key={course._id} className="course-item">
            <h3>{course.C_title}</h3>
            <p>{course.C_description}</p>
            <p><strong>Price: </strong>${course.C_price}</p> {/* Display Price */}
            <button 
              onClick={() => handleEnroll(course._id, course.C_videoUrl)} 
              className="enroll-btn">
              Enroll
            </button>
            <button 
              onClick={() => handlePurchase(course._id)} 
              className="purchase-btn">
              Purchase
            </button> {/* Purchase Button */}

            {/* Display YouTube video if the current course is selected */}
            {selectedCourseId === course._id && course.C_videoUrl && (
              <div className="video-container">
                <iframe
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${getVideoIdFromUrl(course.C_videoUrl)}?autoplay=1&controls=1`}
                  title="Course Introduction Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursePage;
