import express from "express";
const router = express.Router();
// Import the Interest Collection Controller
// This controller contains the logic for handling requests related to interest collections
import interestCollectionController from "../controllers/interestCollectionController.js";

// Create a new Interest Collection
router.post("/", interestCollectionController.createInterestCollection);
// Get all Interest Collections
router.get("/", interestCollectionController.getAllInterestCollections);
// Get a single Interest Collection by ID
router.get("/:id", interestCollectionController.getInterestCollectionById);
// Update an Interest Collection
router.put("/:id", interestCollectionController.updateInterestCollection);
// Delete an Interest Collection
router.delete("/:id", interestCollectionController.deleteInterestCollection);
// Route to get all InterestCollection by sessionId
router.get("/session/:sessionId", interestCollectionController.getInterestCollectionBySessionId);

// Export the router
// This allows the router to be used in other files
export default router;
