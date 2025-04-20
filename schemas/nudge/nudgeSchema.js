import mongoose from "mongoose";

const NudgeSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    files: [
      {
        type: String, // Assuming file URLs or paths are stored
      },
    ],
    audience: {
      type: [String], // Assuming an array of audience IDs or categories
      required: true,
    },
    nudgeTriggerTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
    nudgeType: {
      type: String,
      required: true,
    },
    educatorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Educator",
      required: true,
    },
    educatorName: {
      type: String,
      required: true,
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
  },
  { timestamps: true }
);

const Nudge = mongoose.model("Nudge", NudgeSchema);
export default Nudge;
