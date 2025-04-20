import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    examId: {
      type: String,
      required: true,
      unique: true,
    },
    examCode: {
      type: String,
      required: true,
    },
    sclassId: {
      type: String,
      required: true,
    },
    examDate: {
      type: Date,
      required: true,
    },
    examTime: {
      type: String,
      required: true,
    },
    venues: {
      type: [String],
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Exam = mongoose.model("ExamSchema", examSchema);

export default Exam;
