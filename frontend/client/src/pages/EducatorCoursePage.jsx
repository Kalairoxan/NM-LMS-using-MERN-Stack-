import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './EducatorCoursePage.css';

const EducatorCoursePage = () => {
  const [course, setCourse] = useState({
    C_educator: '',
    C_title: '',
    C_description: '',
    C_categories: [],
    C_price: '',
    C_videoUrl: '',
    sections: [{ title: '', content: '' }],
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value });
  };

  const handleCategoriesChange = (e) => {
    setCourse({ ...course, C_categories: e.target.value.split(',').map(cat => cat.trim()) });
  };

  const handleSectionChange = (index, e) => {
    const newSections = [...course.sections];
    newSections[index][e.target.name] = e.target.value;
    setCourse({ ...course, sections: newSections });
  };

  const addSection = () => {
    setCourse({ ...course, sections: [...course.sections, { title: '', content: '' }] });
  };

  const submitCourse = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post('http://localhost:5000/api/courses/create', course, config);
      alert('Course added successfully');
      setCourse({
        C_educator: '',
        C_title: '',
        C_description: '',
        C_categories: [],
        C_price: '',
        C_videoUrl: '',
        sections: [{ title: '', content: '' }],
      });

      navigate('/courses');
    } catch (error) {
      console.error('Error adding course:', error.response?.data || error);
      alert('Failed to add course');
    }
  };

  return (
    <div className="educator-course-page">
      <h2>Add New Course</h2>
      <form onSubmit={submitCourse}>
        <div className="form-group">
          <label>Educator Name or ID:</label>
          <input
            type="text"
            name="C_educator"
            value={course.C_educator}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Course Title:</label>
          <input
            type="text"
            name="C_title"
            value={course.C_title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="C_description"
            value={course.C_description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Categories (comma separated):</label>
          <input
            type="text"
            name="C_categories"
            value={course.C_categories.join(', ')}
            onChange={handleCategoriesChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            name="C_price"
            value={course.C_price}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Video URL:</label>
          <input
            type="text"
            name="C_videoUrl"
            value={course.C_videoUrl}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="sections">
          <h3>Course Sections</h3>
          {course.sections.map((section, index) => (
            <div key={index} className="section-form">
              <div className="form-group">
                <label>Section Title:</label>
                <input
                  type="text"
                  name="title"
                  value={section.title}
                  onChange={(e) => handleSectionChange(index, e)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Section Content:</label>
                <textarea
                  name="content"
                  value={section.content}
                  onChange={(e) => handleSectionChange(index, e)}
                  required
                />
              </div>
            </div>
          ))}
          <button type="button" onClick={addSection} className="add-section-btn">
            Add Section
          </button>
        </div>
        <button type="submit" className="submit-btn">Submit Course</button>
      </form>
    </div>
  );
};

export default EducatorCoursePage;
