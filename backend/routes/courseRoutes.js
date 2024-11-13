const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const Course = require('../models/Course');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const router = express.Router();

router.post('/create', authMiddleware, async (req, res) => {
  const { C_educator, C_categories, C_title, C_description, sections, C_price, C_videoUrl } = req.body;

  if (!req.user) {
    return res.status(400).json({ error: 'User is not authenticated' });
  }

  try {
    // Convert req.user.id to mongoose ObjectId using 'new'
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Create a new course including the video URL if provided
    const course = new Course({
      userID: userId,
      C_educator,
      C_categories,
      C_title,
      C_description,
      sections,
      C_price,
      C_videoUrl // Include the video URL here
    });

    await course.save();
    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Failed to create course' });
  }
});

// Get all courses route
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch courses' });
  }
});

router.get('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch course' });
  }
});

// Enroll in course route
router.post('/enroll/:courseId', authMiddleware, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Increase the enrollment count
    course.enrolled += 1;
    await course.save();

    res.status(200).json({ message: 'Enrollment successful', course });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Enrollment failed' });
  }
});

// Search courses route
router.get('/search', async (req, res) => {
  const { query } = req.query;
  
  try {
    const courses = await Course.find({
      $or: [
        { C_title: { $regex: query, $options: 'i' } },
        { C_categories: { $regex: query, $options: 'i' } }
      ]
    });

    if (courses.length === 0) {
      return res.status(404).json({ message: 'No courses found' });
    }

    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to search courses' });
  }
});

// Admin middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  if (req.user.type !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }
  next();
};

// Get all users (for admin)
router.get('/users', authMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch users' });
  }
});

// Get all courses (for admin)
router.get('/courses', authMiddleware, isAdmin, async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch courses' });
  }
});

// Delete a course (admin only)
router.delete('/courses/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete course' });
  }
});

// Delete a user (admin only)
router.delete('/users/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete user' });
  }
});


module.exports = router;
