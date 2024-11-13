import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CoursePage from './pages/CoursePage';
import EducatorCoursePage from './pages/EducatorCoursePage';
import AdminDashboard from './pages/AdminDashboard';
const App = () => {
  return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/courses" element={<CoursePage />} />
        <Route path= '/educatorcoursepage' element = {<EducatorCoursePage/>}/>
        <Route path= '/admindashboarde' element = {<AdminDashboard/>}/>
      </Routes>
  );
};

export default App;
