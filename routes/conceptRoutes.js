import express from "express";
import conceptController from "../controllers/conceptController.js";
// import conceptHistoryController from "../controllers/conceptHistoryController.js";
const router = express.Router();

// {Routes}:
router.post("/", conceptController.createConcept); // Create the post.
router.get("/", conceptController.getAllConcepts); // Get all Concepts.
router.get("/:id", conceptController.getConceptById); // get Concepts by ID.
router.put("/update/:id", conceptController.updateConcept); // Update the Concept by ID.
router.delete("/delete/:id", conceptController.deleteConcept); // Delete the Concept by ID.

// Exports the Routes accordingly.
export default router;