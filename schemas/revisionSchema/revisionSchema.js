// Importing the Mongoose Schema.
import mongoose from "mongoose";

// revision-schema
const revisionSchema = new mongoose.Schema({
  FlashCard_ID: { type: String, required: true },
  DateTime: { type: Date, required: true },
  Response: { type: String, enum: ["Correct", "Incorrect"], required: true },
  ResponseTime: { type: Number, required: true },
});

// Exporting: Revision Schema
const revisionExport = mongoose.model("revisionschema", revisionSchema);
export default revisionExport;