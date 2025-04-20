// importing mongoose-model
import mongoose from "mongoose";

// missionSchema
const missionSchema = new mongoose.Schema(
  {
    simulationID: {
      type: mongoose.Schema.Types.ObjectId, // Importing the In-build ObjectID for the Mongoose Schema
      required: true,
      unique: true,
    },
    // MissionID of type MongoDB objectID: auto-generated.
    missionID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    missionStatementHTML: {
      type: String,
      required: true,
    },
    missionTitle: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      default: [], // Default should be fo type empty-String-list
      required: true,
    },
    rightAnswer: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// exporting-missionModel
const missionExport = mongoose.model("mission", missionSchema);
export default missionExport;
