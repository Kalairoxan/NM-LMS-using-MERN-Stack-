// backend/models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // foreign key to User (educator)
  C_educator: { type: String, required: true }, // educator's name or ID
  C_categories: { type: [String], required: true }, // array of categories
  C_title: { type: String, required: true },
  C_description: { type: String },
  sections: [
    {
      title: { type: String, required: true },
      content: { type: String },
    }
  ],
  C_price: { type: Number, required: true },
  C_videoUrl: { type: String }, // New field to store video URL
  enrolled: { type: Number, default: 0 },
  enrolledUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // This tracks users enrolled in the course
});

module.exports = mongoose.model('Course', courseSchema);


