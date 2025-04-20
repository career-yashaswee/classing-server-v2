const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  resourceType: { type: String, required: true },
  title: { type: String, required: true },
  tags: { type: [String], required: true },
  subject: { type: String, required: true },
  course: { type: String, required: true },
  grade: { type: Number, required: true },
  description: { type: String, required: true },
  cover: { type: String, required: true },
  size: { type: Number, required: true },
  resourceURL: { type: String, required: true }
});

const Resource = mongoose.model('Resource', ResourceSchema);

module.exports = Resource;

// JSON Example:

// {
//     "resourceType": "Book",
//     "title": "NCERT-Chemistry Class 8",
//     "tags": ["ncert", "revised edition"],
//     "subject": "Mathematics",
//     "course": "Motion",
//     "grade": 8,
//     "description": "This is the description of the book",
//     "cover": "https://example.com/cover.jpg",
//     "size": 5,
//     "resourceURL": "https://example.com/resource"
// }
  