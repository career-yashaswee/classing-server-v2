import express from "express";
const router = express.Router();

import deckController from "../controllers/deck.js";
// import { authMiddleware } from "../middleware/auth.js";

router.post("/", deckController.createDeck);
router.get("/", deckController.getAllDecks);
router.get("/:id", deckController.getDeckById);
router.put("/:id", deckController.updateDeck);
router.delete("/:id", deckController.deleteDeck);

export default router;