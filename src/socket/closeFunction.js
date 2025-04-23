// Import initializers and utility functions
import activeQuiz from "../data/initializers/activeQuiz.js";
import attentionCheck from "../data/initializers/attentionCheck.js";
import doubtSession from "../data/initializers/doubtSession.js";
import activeFlashcard from "../data/initializers/activeFlashcard.js";
import broadcastToLearners from "./broadcastToLearners.js";

// Track state
let educatorOnline = false;
const closeFunction = (ws) => {
  if (ws.role === "educator") {
    educatorOnline = false;

    // Clear any active sessions
    if (doubtSession.timeoutId) {
      clearTimeout(doubtSession.timeoutId);
    }
    if (attentionCheck.timeoutId) {
      clearTimeout(attentionCheck.timeoutId);
    }

    // Reset sessions
    doubtSession.active = false;
    attentionCheck.active = false;
    // Notify all learners that educator is offline
    broadcastToLearners({ type: "educator_status", online: false });
    // Reset active quiz status but keep the learners set
    activeQuiz.active = false;
    // End active flashcard
    activeFlashcard.active = false;
    // Notify all learners that educator is offline
    broadcastToLearners({ type: "educator_status", online: false });
  } else if (ws.role === "learner" && ws.learnerId) {
    // Remove learner from active learners
    activeQuiz.activeLearners.delete(ws.learnerId);
    // Remove learner from question tracking
    activeQuiz.learnerQuestions.delete(ws.learnerId);
    // Remove from responded learners if present
    activeQuiz.respondedLearners.delete(ws.learnerId);
    // Remove learner responses
    activeQuiz.learnerResponses.delete(ws.learnerId);
    // Remove from flashcard responded learners if present
    activeFlashcard.respondedLearners.delete(ws.learnerId);
    // Remove from flashcard skipped learners if present
    activeFlashcard.skippedLearners.delete(ws.learnerId);
    console.log(`Learner disconnected: ${ws.learnerId}`);
  }
};

export default closeFunction;
