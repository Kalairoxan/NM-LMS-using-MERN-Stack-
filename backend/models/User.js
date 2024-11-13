const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, enum: ['student', 'educator', 'admin'], default: 'student' }, // Added 'admin'
});

const User = mongoose.model('User', userSchema);

module.exports = User;
