import express from "express";
const router = express.Router();

import {
  addDoubt,
  getDoubtsBySessionId,
} from "../controllers/doubtController.js";

// Route to add a new doubt
router.post("/add", addDoubt);

// Route to get all doubts for a session
router.get("/:sessionId", getDoubtsBySessionId);

export default router;
