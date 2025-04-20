import express from "express";
const router = express.Router();

import flashCardController from "../controllers/flashCardController.js";
// import { authMiddleware } from "../middleware/authMiddleware.js";

// Create a new flashcard
router.post("/flashcards", flashCardController.createFlashCard);
// Get all flashcards
router.get("/flashcards", flashCardController.getAllFlashCards);
// Get a single flashcard by ID
router.get("/flashcards/:id", flashCardController.getFlashCardById);
// Update a flashcard by ID
router.put("/flashcards/:id", flashCardController.updateFlashCard);
// Delete a flashcard by ID
router.delete("/flashcards/:id", flashCardController.deleteFlashCard);

export default router;