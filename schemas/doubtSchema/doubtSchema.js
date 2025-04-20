import mongoose from "mongoose";

const DoubtSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  collectionId: { type: mongoose.Schema.Types.ObjectId, required: false },
  studentId: { type: String, required: true },
  doubtText: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  tags: { type: [String], required: true },
});

const Doubt = mongoose.model("Doubt", DoubtSchema);
export default { Doubt };

// JSON Format :

// {
//   "sessionId": "session_12345",
//   "collectionId": "65c8d1f9e73a3d1a5c9f1b4c",
//   "studentId": "student_67890",
//   "doubtText": "Can you explain Newton's third law of motion?",
//   "timestamp": "2025-02-22T10:30:00.000Z",
//   "tags": ["physics", "newton", "laws of motion"]
// }
