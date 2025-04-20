// Importing-express
import express from "express";
const router = express.Router();
import {
  addExam,
  getAllExams,
  getExamByExamId,
  updateExam,
  deleteExam,
} from "../controllers/examController.js";
// Importing the exam controller functions

// Routes
router.post("/", addExam); // Create a new exam
router.get("/", getAllExams); // Get all exams
router.get("/:examId", getExamByExamId); // Get an exam by examId
router.put("/:examId", updateExam); // Update an exam by examId
router.delete("/:examId", deleteExam); // Delete an exam by examId

export default router;
// Exporting the router
