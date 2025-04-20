import FlashCard from "../schemas/flashCardSchema/flashCard.js";

// Create a new FlashCard
const createFlashCard = async (req, res) => {
  try {
    const flashCard = new FlashCard(req.body);
    await flashCard.save();
    res.status(201).json(flashCard);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all FlashCards
const getAllFlashCards = async (req, res) => {
  try {
    const flashCards = await FlashCard.find();
    res.status(200).json(flashCards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single FlashCard by ID
const getFlashCardById = async (req, res) => {
  try {
    const flashCard = await FlashCard.findById(req.params.id);
    if (!flashCard) {
      return res.status(404).json({ message: "FlashCard not found" });
    }
    res.status(200).json(flashCard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a FlashCard by ID
const updateFlashCard = async (req, res) => {
  try {
    req.body.updatedAt = Date.now(); // Update the timestamp
    const flashCard = await FlashCard.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!flashCard) {
      return res.status(404).json({ message: "FlashCard not found" });
    }
    res.status(200).json(flashCard);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a FlashCard by ID
const deleteFlashCard = async (req, res) => {
  try {
    const flashCard = await FlashCard.findByIdAndDelete(req.params.id);
    if (!flashCard) {
      return res.status(404).json({ message: "FlashCard not found" });
    }
    res.status(200).json({ message: "FlashCard deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  createFlashCard,
  getAllFlashCards,
  getFlashCardById,
  updateFlashCard,
  deleteFlashCard,
};
