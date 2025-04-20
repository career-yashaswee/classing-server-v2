import Deck from "../schemas/flashCardSchema/deckFC.js";

// Create a new Deck
const createDeck = async (req, res) => {
  try {
    const deck = new Deck(req.body);
    await deck.save();
    res.status(201).json(deck);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all Decks
const getAllDecks = async (req, res) => {
  try {
    const decks = await Deck.find().populate("flashCards");
    res.status(200).json(decks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single Deck by ID
const getDeckById = async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id).populate("flashCards");
    if (!deck) {
      return res.status(404).json({ message: "Deck not found" });
    }
    res.status(200).json(deck);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a Deck by ID
const updateDeck = async (req, res) => {
  try {
    req.body.updatedAt = Date.now(); // Update timestamp
    const deck = await Deck.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!deck) {
      return res.status(404).json({ message: "Deck not found" });
    }
    res.status(200).json(deck);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a Deck by ID
const deleteDeck = async (req, res) => {
  try {
    const deck = await Deck.findByIdAndDelete(req.params.id);
    if (!deck) {
      return res.status(404).json({ message: "Deck not found" });
    }
    res.status(200).json({ message: "Deck deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  createDeck,
  getAllDecks,
  getDeckById,
  updateDeck,
  deleteDeck,
};
// Importing the Deck model