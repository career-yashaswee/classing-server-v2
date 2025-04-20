// models/Quiz.js
import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    default: null,
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  complexity: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },
  quizType: {
    type: String,
    enum: ["select", "type"],
    required: true,
  },
  options: [
    {
      text: String,
      isCorrect: Boolean,
    },
  ],
  typeAnswers: [
    {
      type: String,
      trim: true,
    },
  ],
  deckId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Deck",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
