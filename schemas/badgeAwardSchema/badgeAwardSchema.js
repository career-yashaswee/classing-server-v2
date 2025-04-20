import mongoose from "mongoose";

// Badge Award Schema
const badgeAwardSchema = new mongoose.Schema(
    {
      badge: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Badge",
        required: true,
      },
      studentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "studentSchema",
        required: true,
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
      eventTime: {
        type: Date,
        default: Date.now,
      },
      awardee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true, // The user who awarded the badge
      },
    },
    { timestamps: true }
  );
  
const BadgeAward = mongoose.model("BadgeAward", badgeAwardSchema);    
export { BadgeAward };