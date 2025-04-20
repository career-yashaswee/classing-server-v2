import express from "express";
const router = express.Router();
// leaderboardRoutes.js
// Import the leaderboard controller
import leaderboardController from "../controllers/leaderboardController.js";

// Create a new leaderboard
router.post("/", leaderboardController.createLeaderboard);
// Get all leaderboards
router.get("/", leaderboardController.getAllLeaderboards);
// Get a leaderboard by ID
router.get("/:id", leaderboardController.getLeaderboardById);
// Update a leaderboard by ID
router.put("/:id", leaderboardController.updateLeaderboard);
// Delete a leaderboard by ID
router.delete("/:id", leaderboardController.deleteLeaderboard);
// Get all leaderboards by SClassID
router.get("/class/:sclassID", leaderboardController.getLeaderboardBySClassID);
// Get leaderboard items by LeaderboardID
router.get("/:leaderboardID/item", leaderboardController.getLeaderboardItemsByLeaderboardID);

export default router;
