import mongoose from "mongoose";

const flashCardSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  answer: {
    type: String,
    required: true,
    trim: true,
  },
  hint: {
    type: String,
    trim: true,
  },
  image: {
    type: String, // URL to an image if the flashcard has one
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  difficultyLevel: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    required: true,
  },
  deck: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "deckFC", // Linking flashcards to a deck
    required: true,
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const FlashCard = mongoose.model("FlashCard", flashCardSchema);
export default FlashCard;
