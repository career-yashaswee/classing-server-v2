import mongoose from "mongoose";

const SimulationSchema = new mongoose.Schema({
  URL: { type: String, required: true },
  title: { type: String, required: true },
  subject: { type: String, required: true },
  course: { type: String, required: true },
  gradeLevel: { type: String, required: true },
  compatibility: { type: [String], enum: ["HTML5", "JAVA"], required: true },
  a11y: { type: [String], required: true },
  locale: { type: [String], required: true, enum: ["EN_IN", "HI_IN"] },
});

const Simulation = mongoose.model("Simulation", SimulationSchema);
export default Simulation;

// JSON Database:

// {
//     "URL": "https://example.com/simulation",
//     "title": "Acid Base Solution",
//     "subject": "Mathematics",
//     "course": "Motion",
//     "gradeLevel": "Elementary School",
//     "compatibility": ["HTML5", "JAVA"],
//     "a11y": ["Alternative Input", "Camera Input"],
//     "locale": ["EN_IN", "HI_IN"]
//   }
