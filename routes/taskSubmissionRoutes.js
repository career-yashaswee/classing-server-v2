import express from "express";
import taskSubmissionController from "../controllers/taskSubmissionController.js";
const router = express.Router();

// Create a new task submission
router.post("/", taskSubmissionController.createSubmission);
// Get all submissions
router.get("/", taskSubmissionController.getAllSubmissions);
// Get submission by ID
router.get("/:id", taskSubmissionController.getSubmissionById);
// Get submissions by Student ID
router.get("/student/:studentID", taskSubmissionController.getSubmissionByStudentID);
// Update submission score and feedback
router.put("/:id", taskSubmissionController.updateSubmission);
// Delete submission by ID
router.delete("/:id", taskSubmissionController.deleteSubmission);

export default router
