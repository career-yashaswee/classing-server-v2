import KanbanTask from "../schemas/kanbanSchema/kanbanSchema.js"; // Import the schema

// Create a new task
const createTask = async (req, res) => {
  try {
    const { id, title, description, tag, date, image } = req.body;
    const newTask = new KanbanTask({ id, title, description, tag, date, image });
    await newTask.save();
    res.status(201).json({ message: "Task created successfully!", task: newTask });
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error });
  }
};

// Read all tasks
const getAllTasks = async (req, res) => {
  try {
    const tasks = await KanbanTask.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
};

// Read a single task by ID
const getTaskById = async (req, res) => {
  try {
    const task = await KanbanTask.findOne({ id: req.params.id });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error fetching task", error });
  }
};

// Update a task by ID
const updateTask = async (req, res) => {
  try {
    const updatedTask = await KanbanTask.findOneAndUpdate(
      { id: req.params.id },
      req.body, 
      { new: true }
    );
    if (!updatedTask) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
};

// Delete a task by ID
const deleteTask = async (req, res) => {
  try {
    const deletedTask = await KanbanTask.findOneAndDelete({ id: req.params.id });
    if (!deletedTask) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task deleted successfully", task: deletedTask });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
};

export default{
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  // Add any other functions you need here
}
