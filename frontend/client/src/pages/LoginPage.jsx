// LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPageStyle.css';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send login request to the backend
      const response = await axios.post('http://localhost:5000/api/users/login', formData);
      const { token, user } = response.data;

      if (token && user) {
        // Save token, role, and userId in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('role', user.type);  // Save the user role (admin, educator, student)
        localStorage.setItem('userId', user._id);  // Save user ID

        alert('Login successful');

        // Redirect to the appropriate page based on role
        if (user.type === 'admin') {
          navigate('/admin-dashboard'); // Redirect to admin dashboard
        } else if (user.type === 'educator') {
          navigate('/educatorcoursepage'); // Redirect to educator course page
        } else {
          navigate('/courses'); // Redirect to student course page
        }
      } else {
        setError('Invalid login credentials');
      }
    } catch (error) {
      setError('Login failed');
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="submit-btn">Login</button>
        </form>
        <p>
          Don't have an account?{' '}
          <Link to="/register" className="register-link">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
