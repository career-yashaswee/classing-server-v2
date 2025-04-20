import mongoose from "mongoose";
import Deck from "../schemas/quiz/deck.js";

const deckController = {
  createDeck: async (req, res) => {
    try {
      const deck = new Deck(req.body);
      await deck.save();
      res.status(201).json(deck);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getAllDecks: async (req, res) => {
    try {
      const decks = await Deck.find().populate("author", "name email");
      res.status(200).json(decks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getDeckById: async (req, res) => {
    try {
      const deck = await Deck.findById(req.params.id).populate(
        "author",
        "name email"
      );
      if (!deck) return res.status(404).json({ message: "Deck not found" });
      res.status(200).json(deck);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateDeck: async (req, res) => {
    try {
      const deck = await Deck.findByIdAndUpdate(
        req.params.id,
        { ...req.body, updatedAt: Date.now() },
        { new: true }
      );
      if (!deck) return res.status(404).json({ message: "Deck not found" });
      res.status(200).json(deck);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteDeck: async (req, res) => {
    try {
      const deck = await Deck.findByIdAndDelete(req.params.id);
      if (!deck) return res.status(404).json({ message: "Deck not found" });
      res.status(200).json({ message: "Deck deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default deckController;
