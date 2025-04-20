const mongoose = require('mongoose');
const Subject = require('../subjectSchema/subjectSchema');

const CourseSchema = new mongoose.Schema({
  course_name: { 
    type: String, 
    required: true, 
    trim: true, 
  },
  subject_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Subject', // References Subject model for the Subject.
    required: true,
  }
}, { timestamps: true });

const Course = mongoose.model('Course', CourseSchema);
module.exports = Course;

// JSON Format : 
// 
// {
//   "course_name": "Mathematics 101",
//   "subject_id": "65c8d1f9e73a3d1a5c9f1b4c",
//   "createdAt": "2025-02-22T10:30:00.000Z",
//   "updatedAt": "2025-02-22T10:30:00.000Z"
// }
