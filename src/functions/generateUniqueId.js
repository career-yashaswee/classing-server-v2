// This function generates a unique ID for learners
// to ensure that each learner has a distinct identifier.
// This is important for tracking their progress and interactions during the session.

// Function to generate a unique ID for learners
function generateUniqueId() {
  return Math.random().toString(36).substring(2, 10);
}

export default generateUniqueId;
