// Importing the Mongoose Schema.
import mongoose from "mongoose";

// revision-schema
const revisionSchema = new mongoose.Schema({
  FlashCard_ID: { type: String, required: true },
  DateTime: { type: Date, required: true },
  Response: { type: String, enum: ["Correct", "Incorrect"], required: true },
  ResponseTime: { type: Number, required: true },
});

// concept-history-schema
const conceptHistorySchema = new mongoose.Schema({
  StudentID: { type: String, required: true },
  ConceptID: { type: String, required: true },
  Level: { type: Number, required: true },
  // revision-schema: Export the schema
  RevisionsAttempts: { type: [revisionSchema], required: true },
});

// Export: Concept-History-Module
const conceptHistoryModel = mongoose.model(
  "conceptHistorySchema",
  conceptHistorySchema
);
export default conceptHistoryModel;
