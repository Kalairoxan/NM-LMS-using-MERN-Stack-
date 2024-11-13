import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        const coursesRes = await axios.get('http://localhost:5000/api/admin/courses', config);
        const usersRes = await axios.get('http://localhost:5000/api/admin/users', config);
        
        console.log('Courses:', coursesRes.data); // Log courses to check the data
        console.log('Users:', usersRes.data); // Log users to check the data
        
        setCourses(coursesRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchData();
  }, []);
  

  const handleDeleteCourse = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`http://localhost:5000/api/admin/courses/${courseId}`, config);
      setCourses(courses.filter(course => course._id !== courseId));
      alert('Course deleted successfully');
    } catch (error) {
      alert('Error deleting course');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, config);
      setUsers(users.filter(user => user._id !== userId));
      alert('User deleted successfully');
    } catch (error) {
      alert('Error deleting user');
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <div className="dashboard-section">
        <h3>Manage Courses</h3>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Educator</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course._id}>
                <td>{course.C_title}</td>
                <td>{course.C_educator}</td>
                <td>{course.C_price}</td>
                <td>
                  <button onClick={() => handleDeleteCourse(course._id)} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="dashboard-section">
        <h3>Manage Users</h3>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.type}</td>
                <td>
                  <button onClick={() => handleDeleteUser(user._id)} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
