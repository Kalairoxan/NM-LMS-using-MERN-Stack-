const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/User'); // Import the User model
const authMiddleware = require('../middleware/authMiddleware'); // Import the authMiddleware
const router = express.Router();

// Create JWT Token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
}

// Register Route
router.post('/register', async (req, res) => {
  const { name, email, password, type } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Validate email format and password strength
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log("Hashed Password:", hashedPassword);  // Debugging log

    // Create a new user with hashed password
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      type,
    });

    await newUser.save();

    // Generate JWT token
    const token = createToken(newUser._id);

    // Respond with success
    res.status(201).json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error during registration' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    // Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Create JWT token
    const tokenData = { userId: user._id };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Format user object to send in response
    const loggedInUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      type: user.type, // Include user type (admin, educator, student)
    };

    // Send token and user data in response
    return res.status(200).json({
      message: `Welcome back ${loggedInUser.name}`,
      token,
      user: loggedInUser,
    });

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



// Profile Route
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);  // Use the decoded user ID from JWT
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user profile
    res.json({ name: user.name, email: user.email });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to fetch user profile' });
  }
});

module.exports = router;
