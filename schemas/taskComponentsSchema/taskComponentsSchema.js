import mongoose from "mongoose";

// Define the TaskComponent schema
const taskComponentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  }, // Title of the component (e.g., "Report", "Code Implementation")
  description: {
    type: String,
  }, // Optional description of the component
  weightage: {
    type: Number,
    required: true,
  }, // Percentage contribution to the total task score
  maxMarks: {
    type: Number,
    required: true,
  }, // Maximum marks allocated for this component
  submissionType: {
    type: String,
    enum: ["File Upload", "Text Submission", "Quiz", "Code", "Video"],
    required: true,
  }, // Specifies the submission type
});

// Create and export the TaskComponent model
const TaskComponent = mongoose.model("TaskComponent", taskComponentSchema);
export default TaskComponent;
