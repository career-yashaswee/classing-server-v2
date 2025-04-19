// This file initializes the activeFlashcard object with default values.
// It contains properties to track the state of the active flashcard,

// Flashcard state
let activeFlashcard = {
  active: false,
  type: null, // 'quiz', 'content', or 'qa' (question/answer)
  title: "",
  content: "",
  subTopics: [],
  question: null,
  options: [],
  correctAnswer: "",
  responses: [],
  respondedLearners: new Set(),
  skippedLearners: new Set(), // Track learners who skipped
};

export default activeFlashcard;