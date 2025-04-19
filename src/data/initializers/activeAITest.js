// This file initializes the activeAITest object, which is used to manage the state of the AI test.
// It contains properties to track the state of the active AI test,

// AI-test initializer
let activeAITest = {
  active: false,
  testType: null, // 'normal' or 'assist'
  complexity: null, // 'easy', 'medium', or 'hard'
  subTopics: [],
  prompt: "",
  currentQuestion: null,
  currentLearner: null,
  learnerProgress: new Map(), // Map of learnerId -> { questions: [], answers: [], currentQuestionIndex, report }
  completedLearners: new Set(),
};

export default activeAITest;