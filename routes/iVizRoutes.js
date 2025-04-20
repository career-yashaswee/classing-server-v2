import express from "express";
const router = express.Router();
import { createVisualization, getVisualizationById, updateVisualization, deleteVisualization, getAllVisualizations} from "../controllers/iVizController.js"; // Ensure the correct path

// Create a new visualization
router.post("/create", createVisualization);
// Get a visualization by ID
router.get("/:id", getVisualizationById);
// Update a visualization by ID
router.put("/:id", updateVisualization);
// Delete a visualization by ID
router.delete('/:id', deleteVisualization);
// Get a visualization
router.get('/', getAllVisualizations);

export default router;
