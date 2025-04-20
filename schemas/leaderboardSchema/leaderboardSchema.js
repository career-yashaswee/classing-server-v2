import mongoose from "mongoose";

const leaderboardItemSchema = new mongoose.Schema(
  {
    studentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "studentSchema",
      required: true,
      index: true,
    },
    points: {
      type: Number,
      required: true,
      default: 0,
      min: 0, // Ensuring points are non-negative
    },
    leaderboardID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Leaderboard",
        required: true,
    },
  },
  { _id: false } // Prevents auto-generating an ID for subdocuments
);

const leaderboardSchema = new mongoose.Schema(
  {
    SClassID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SchoolClass",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    view: {
      type: String,
      enum: ["PUBLIC", "PRIVATE"],
      required: true,
      default: "PUBLIC",
    },
    leaderboardItems: [leaderboardItemSchema],
  },
  { timestamps: true } // Adds createdAt & updatedAt fields
);

const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);
export default Leaderboard;
