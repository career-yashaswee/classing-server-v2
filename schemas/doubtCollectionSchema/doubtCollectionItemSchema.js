import mongoose from "mongoose";

const doubtCollectionItemSchema = new mongoose.Schema({
  // collectionId: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Auto-generate ObjectId
  summary: { type: String, required: true }, // Summary text
  category: {
    type: [String],
    enum: ["Theoretical", "Conceptual"],
    required: true,
  }, // Array of valid categories
  count: { type: Number, required: true }, // Number of related doubts
  complexity: { type: Number, min: 1, max: 10, required: true }, // Complexity level (1 to 5)
  timeArrived: { type: Date, required: true, default: Date.now }, // Timestamp
  isAiSummarized: { type: Boolean, default: false }, // Boolean flag
  aiRating: {
    type: String,
    enum: ["Most Asked", "Common", "Rare"],
    required: true,
  }, // AI Rating (fixed options)
  originalDoubts: { type: [String], required: true }, // List of questions
});

// Exporting the Model
const DoubtCollectionItemSchema = mongoose.model(
  "DoubtCollectionItem",
  doubtCollectionItemSchema
);
export default DoubtCollectionItemSchema;

// EXAMPLE:
// {
//   "tackled": 3,
//   "doubts": [
//     {
//       "summary": "Understanding the theory behind **Big_O_notation** and its role in **algorithm_analysis** for measuring time and space complexities",
//       "category": ["Theoretical"],
//       "count": 7,
//       "complexity": 4,
//       "timeArrived": "2023-05-10T10:02:00.000Z",
//       "isAiSummarized": true,
//       "aiRating": "Most Asked",
//       "originalDoubts": [
//         "What is **Big_O_notation** and why is it important in **algorithm_analysis**?",
//         "How do we calculate the **time_complexity** of an algorithm using **Big_O_notation**?",
//         "Can **Big_O_notation** describe both **time** and **space_complexity**?"
//       ]
//     },
//     {
//       "summary": "Exploring **Dynamic Programming** concepts with real-world examples and optimization techniques.",
//       "category": ["Conceptual"],
//       "count": 5,
//       "complexity": 5,
//       "timeArrived": "2023-06-15T14:30:00.000Z",
//       "isAiSummarized": false,
//       "aiRating": "Common",
//       "originalDoubts": [
//         "What is the main idea behind **Dynamic Programming**?",
//         "How does **memoization** help in reducing time complexity?",
//         "Can we apply **Dynamic Programming** to all recursive problems?"
//       ]
//     }
//   ]
// }
