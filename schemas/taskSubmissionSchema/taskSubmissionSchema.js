import mongoose from "mongoose";

// Define the TaskSubmission schema
const taskSubmissionSchema = new mongoose.Schema({
  studentID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "studentSchema",
    required: true,
  }, // Reference to the student submitting the task

  componentSubmissions: [
    {
      componentID: {
        type: mongoose.Schema.Types.ObjectId, // ERROR: Check the USER_ID Accordingly.
        ref: "TaskComponent",
        required: true,
      }, // Each submission belongs to a specific task component

      submittedData: {
        type: String,
        required: true,
      }, // Data submitted (file URL, text response, quiz answer, etc.)

      score: {
        type: Number,
        default: null,
      }, // Marks assigned to the component

      feedback: {
        type: String,
        default: "",
      }, // Instructor's feedback
    },
  ],

  submittedAt: {
    type: Date,
    default: Date.now,
  }, // Timestamp of submission

  gradedAt: {
    type: Date,
  }, // Timestamp when grading was completed
});

// Create and export the TaskSubmission model
const TaskSubmission = mongoose.model("TaskSubmission", taskSubmissionSchema);
export default TaskSubmission;
