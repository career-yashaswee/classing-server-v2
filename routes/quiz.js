// routes/quiz.routes.js
import express from "express";
const router = express.Router();

import quizController from "../controllers/quiz.js";
// import { authMiddleware } from "../middlewares/auth.js";

router.post("/", quizController.createQuiz);
router.get("/deck/:deckId", quizController.getQuizzesByDeck);
router.get("/:id", quizController.getQuizById);
router.put("/:id", quizController.updateQuiz);
router.delete("/:id", quizController.deleteQuiz);

export default router;