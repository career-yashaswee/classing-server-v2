// controllers/quiz.controller.js
import Quiz from "../schemas/quiz/quiz.js";
import Deck from "../schemas/quiz/deck.js";

const quizController = {
  createQuiz: async (req, res) => {
    try {
      const quiz = new Quiz(req.body);
      await quiz.save();

      // Update quiz count in deck
      await Deck.findByIdAndUpdate(req.body.deckId, { $inc: { quizCount: 1 } });

      res.status(201).json(quiz);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getQuizzesByDeck: async (req, res) => {
    try {
      const quizzes = await Quiz.find({ deckId: req.params.deckId });
      res.status(200).json(quizzes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getQuizById: async (req, res) => {
    try {
      const quiz = await Quiz.findById(req.params.id);
      if (!quiz) return res.status(404).json({ message: "Quiz not found" });
      res.status(200).json(quiz);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateQuiz: async (req, res) => {
    try {
      const quiz = await Quiz.findByIdAndUpdate(
        req.params.id,
        { ...req.body, updatedAt: Date.now() },
        { new: true }
      );
      if (!quiz) return res.status(404).json({ message: "Quiz not found" });
      res.status(200).json(quiz);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteQuiz: async (req, res) => {
    try {
      const quiz = await Quiz.findById(req.params.id);
      if (!quiz) return res.status(404).json({ message: "Quiz not found" });

      await Quiz.findByIdAndDelete(req.params.id);

      // Update quiz count in deck
      await Deck.findByIdAndUpdate(quiz.deckId, { $inc: { quizCount: -1 } });

      res.status(200).json({ message: "Quiz deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default quizController;
