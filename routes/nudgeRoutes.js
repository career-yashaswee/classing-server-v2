import express from "express";
const router = express.Router();

import nudgeController from "../controllers/nudgeController.js";
// import { verifyToken } from "../middleware/auth.js";

// Create a new Nudge
router.post("/", nudgeController.createNudge);
// Get all Nudges
router.get("/", nudgeController.getAllNudges);
// Get a single Nudge by ID
router.get("/:id", nudgeController.getNudgeById);
// Update a Nudge by ID
router.put("/:id", nudgeController.updateNudge);
// Delete a Nudge by ID
router.delete("/:id", nudgeController.deleteNudge);
// Route to get nudges by sessionId
router.get("/session/:sessionId", nudgeController.getNudgeBySessionId);

export default router;
