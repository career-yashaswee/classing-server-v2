// This file initializes the attention check object with default values.
// It is used to track the state of the attention check during a quiz or survey.

let attentionCheck = {
  active: false,
  question: null,
  options: [],
  startTime: null,
  responses: {},
  timeoutId: null,
};

export default attentionCheck;
