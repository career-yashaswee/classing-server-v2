// Importing Express Router
import express from "express";
const router = express.Router();

// Importing the conceptHistory-controller
import {
  createConceptHistory,
  getAllConceptHistories,
  getConceptHistoryById,
  updateConceptHistory,
  deleteConceptHistory,
} from "../controllers/conceptHistoryController.js";
// Importing the concept-history Schema.

// API declarations
router.post("/", createConceptHistory);
router.get("/", getAllConceptHistories);
router.get("/:id", getConceptHistoryById);
router.put("/:id", updateConceptHistory);

// Export the Router
export default router;