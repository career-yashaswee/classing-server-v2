import express from "express";
const router = express.Router();

import engagementController from "../controllers/engagementController.js"; // Importing the controller
// Importing the controller for engagement routes

// Create a new engagement
router.post("/", engagementController.createEngagement);
// Get all engagements
router.get("/", engagementController.getAllEngagements);
// Get a single engagement by ID
router.get("/:id", engagementController.getEngagementById);
// Update an engagement by ID
router.put("/:id", engagementController.updateEngagement);
// Delete an engagement by ID
router.delete("/:id", engagementController.deleteEngagement);

export default router;
