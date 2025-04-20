import mongoose from "mongoose";

const interestCollectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  expressionType: {
    type: String,
    enum: ["WordCloud", "Scales", "MCQ"],
    required: true,
  },
  collectionStartTime: {
    type: Date,
    required: true,
  },
  collectionEndTime: {
    type: Date,
    required: true,
  },
  participants: {
    type: Number,
    required: true,
    min: 1,
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session",
    required: true,
  },
});

const InterestCollection = mongoose.model(
  "InterestCollection",
  interestCollectionSchema
);
export default InterestCollection;
