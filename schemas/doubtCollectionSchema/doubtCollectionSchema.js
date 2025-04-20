import mongoose from "mongoose";
// const doubtItem = require("./doubtCollectionItemSchema").schema;

// MAIN :
const doubtCollectionSchema = new mongoose.Schema({
  sessionID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session",
    required: true,
  },
  tackled: { type: Number, required: true, default: 0 },
  doubts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DoubtCollectionItem",
      required: true,
    },
  ], // Array of references to Doubt schema
});

// Return the Export Schema.
const DoubtCollection = mongoose.model(
  "DoubtCollection",
  doubtCollectionSchema
);
export default DoubtCollection;

// sessionID : ObjectId('65c8d1f9e73a3dla5c9f1b9a')
