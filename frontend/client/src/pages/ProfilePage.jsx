import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import './ProfilePageStyle.css'; // Import the CSS file for styling
import img from './asset/ProfilePageImg.png';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isActive, setIsActive] = useState(false); // State to trigger the shake effect on page load
  const navigate = useNavigate();

  // Handle Sign Out function
  const handleSignOut = () => {
    // Remove user info from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    
    // Redirect user to login page
    navigate('/login');
  };

  useEffect(() => {
    // Check if the token exists, if not redirect to login
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch user profile on page load
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // If response does not contain valid user data
        if (!response.data) {
          setError('Account not found.');
          return;
        }

        setUser(response.data);  // Set user data if logged in
        setIsActive(true); // Trigger the shake animation on page load
      } catch (error) {
        // If there is an error fetching the profile, show login/register options
        setError('Failed to fetch profile');
        console.error('Error fetching user profile:', error.response || error);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (error) {
    return (
      <div className="profile-page" style={{ backgroundImage: `url(${img})` }}>
        <div className="profile-box active">
          <h2 className="profile-title">Profile</h2>
          <p className="profile-message">Please log in or register to access your profile.</p>
          <Link to="/login" className="btn login-btn">Login</Link>
          <Link to="/register" className="btn register-btn">Register</Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="profile-page" style={{ backgroundImage: `url(${img})` }}>
      <div className={`profile-box ${isActive ? 'active' : ''}`}>
        <h1 className="profile-title">Your Profile</h1>
        <p>Welcome, {user.name}!</p>
        <div className="profile-info">
          <div className="profile-item">
            <strong>Name:</strong> <span>{user.name}</span>
          </div>
          <div className="profile-item">
            <strong>Email:</strong> <span>{user.email}</span>
          </div>
          <div className="profile-item">
            <strong>Role:</strong> <span>{user.type}</span> {/* Show the role */}
          </div>
        </div>

        {/* Sign out button */}
        <button onClick={handleSignOut} className="signout-btn">Sign Out</button>
      </div>
    </div>
  );
};

export default ProfilePage;
