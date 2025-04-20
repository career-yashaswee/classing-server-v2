import mongoose from "mongoose";

const kanbanSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    tag: { type: String, required: true },
    date: { type: Date, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true } // Adds createdAt & updatedAt fields
);

const KanbanTask = mongoose.model("KanbanTask", kanbanSchema);

export default KanbanTask;
    