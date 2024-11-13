import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RegisterPageStyle.css';
import { Link } from 'react-router-dom';

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    type: 'student', // Default to 'student'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', formData);
      localStorage.setItem('token', response.data.token);
      alert('Registration successful');
      
      // Redirect based on user type
      if (formData.type === 'educator') {
        navigate('/educatorcoursepage'); // Redirect to EducatorCoursePage for educators
      } else {
        navigate('/courses'); // Redirect to courses page for students
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed';
      console.error('Error during registration:', errorMsg);
      setError(errorMsg); // Display detailed error message from backend
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-form">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
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
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="student">Student</option>
            <option value="educator">Educator</option>
          </select>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="submit-btn">Register</button>
        </form>
        <p>
          Already have an account?{' '}
          <Link to="/login" className="login-link">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegistrationPage;
