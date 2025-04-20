// Importing Mongoose
import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    resultId: {
      type: String,
      required: true,
      unique: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    examId: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    maximumMarks: {
      type: Number,
      required: true,
    },
    grade: {
      type: String,
      required: true,
    },
    result: {
      type: String,
      enum: ["pass", "fail"],
      required: true,
    },
  },
  { timestamps: true }
);

const resultExport = mongoose.model("resultSchema", resultSchema);

export default resultExport;

// JSON

// {
//   "resultId": "RES-12345",
//   "studentId": "STU-56789",
//   "examId": "EX2025-01",
//   "score": 78,
//   "maximumMarks": 100,
//   "grade": "B+",
//   "result": "pass"
// }
