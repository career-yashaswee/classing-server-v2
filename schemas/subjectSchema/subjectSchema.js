const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  subject_name: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
  },
}, { timestamps: true });

const Subject = mongoose.model('Subject', SubjectSchema);
module.exports = Subject;

// JSON Format : 
//
// {
//   "_id": "65d7a9c4e3f4b2a1d6e8f7b9",
//   "subject_name": "Mathematics",
//   "createdAt": "2024-02-22T12:00:00.000Z",
//   "updatedAt": "2024-02-22T12:00:00.000Z",
//   "__v": 0
// }
