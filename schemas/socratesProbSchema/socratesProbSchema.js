import mongoose from "mongoose";

const SocratesProbSchema = new mongoose.Schema(
  {
    asset: [{
      type: String,
      required: false,
    }],
    learningObjective: {
      type: String,
      required: true,
    },
    complexity: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnType: {
      type: String,
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    sessionID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    assistMode: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const SocratesProb = mongoose.model("SocratesProb", SocratesProbSchema);
export default SocratesProb;
