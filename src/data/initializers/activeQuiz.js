// This file initializes the active quiz state for the application.
// It is used to track the state of the quiz, including the current question, responses, and active learners.

const activeQuiz = {
    active: false,
    questions: [],
    currentQuestionIndex: -1,
    responses: {},
    activeLearners: new Set(),
    respondedLearners: new Set(),
    learnerQuestions: new Map(),
    learnerResponses: new Map(),
  };
  
export default activeQuiz;
  