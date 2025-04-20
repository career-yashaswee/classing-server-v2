import express from "express";
const router = express.Router();
import {
  createResult,
  getAllResults,
  getResultByResultId,
  getResultByStudentId,
  updateResult,
  deleteResult,
} from "../controllers/resultController.js";

// routes
router.post("/", createResult);
router.get("/", getAllResults);
router.get("/id/:resultId", getResultByResultId); // Get result by ResultID
router.get("/student/:studentId", getResultByStudentId); // Get result by StudentID
router.put("/:resultId", updateResult);
router.delete("/:resultId", deleteResult);

export default router;
