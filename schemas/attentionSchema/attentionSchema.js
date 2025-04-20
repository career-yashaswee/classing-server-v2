import mongoose from "mongoose";

const attentionSchema = new mongoose.Schema(
  {
    roll: {
      type: Number,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    attentionIndex: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Late"],
      required: true,
    },
    action: {
      type: String,
      default: null,
      trim: true,
    },
  },
  { timestamps: true }
);

const Attention = mongoose.model("attentionSchema", attentionSchema);
export default Attention;

// JSON Format :
//
// {
//   "_id": "64f8a7d8b5f2c3a1d4e5f6b7",
//   "roll": 101,
//   "name": "John Doe",
//   "attentionIndex": 85,
//   "status": "Present",
//   "action": "Participated",
//   "createdAt": "2024-02-22T12:00:00.000Z",
//   "updatedAt": "2024-02-22T12:00:00.000Z",
//   "__v": 0
// }
