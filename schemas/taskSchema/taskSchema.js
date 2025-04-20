import mongoose from "mongoose";

// Task-Item Schema
const taskItemSchema = new mongoose.Schema([
  {
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    subject: { type: String, required: true }, // Subject related to the task
    grade: { type: Number, required: true }, // Grade Level
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserSchema",
      required: true,
    }, // Educator assigning the Task
    dueDate: { type: Date, required: true },
    course: { type: String, required: true },
    type: { type: String, required: true },
    components: [
      { type: mongoose.Schema.Types.ObjectId, ref: "TaskComponent" },
    ], // Modular component references
    maximumMarks: { type: Number, required: true },
    // marksScored: { type: Number, default: null },
    material: { type: String, default: null },
    status: { type: String, enum: ["Active", "Closed"], default: "Active" }, // Task Status
    tags: { type: [String], required: true },
  },
]);

// Export
const Task = mongoose.model("TaskItemSchema", taskItemSchema);
export default Task;

// JSON Example.

// {
//   "sessionId": "65c8d1f9e73a3d1a5c9f1b9a",
//   "title": "Algebra Practice Task",
//   "description": "Solve the given algebraic equations and submit the answers.",
//   "subject": "Mathematics",
//   "grade": 9,
//   "assignedBy": "65b77d9e13582a4c2eae2bdf",
//   "dueDate": "2025-03-10T23:59:59.000Z",
//   "course": "Algebra 101",
//   "type": "Homework",
//   "components": [
//     "65b77d9e13582a4c2eae2bd1",
//     "65b77d9e13582a4c2eae2bd2"
//   ],
//   "maximumMarks": 100,
//   "marksScored": null,
//   "material": "https://example.com/algebra-material.pdf",
//   "status": "Active",
//   "tags": ["Algebra", "Equations", "Mathematics"]
// }
