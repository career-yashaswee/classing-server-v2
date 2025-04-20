import TaskComponent from "../schemas/taskComponentsSchema/taskComponentsSchema.js";

// Create a new Task Component
const createTaskComponent = async (req, res) => {
  try {
    const taskComponent = new TaskComponent(req.body);
    await taskComponent.save();
    res.status(201).json(taskComponent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all Task Components
const getAllTaskComponents = async (req, res) => {
  try {
    const taskComponents = await TaskComponent.find();
    res.status(200).json(taskComponents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single Task Component by ID
const getTaskComponentById = async (req, res) => {
  try {
    const taskComponent = await TaskComponent.findById(req.params.id);
    if (!taskComponent) {
      return res.status(404).json({ message: "Task Component not found" });
    }
    res.status(200).json(taskComponent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a Task Component by ID
const updateTaskComponent = async (req, res) => {
  try {
    const taskComponent = await TaskComponent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!taskComponent) {
      return res.status(404).json({ message: "Task Component not found" });
    }
    res.status(200).json(taskComponent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a Task Component by ID
const deleteTaskComponent = async (req, res) => {
  try {
    const taskComponent = await TaskComponent.findByIdAndDelete(req.params.id);
    if (!taskComponent) {
      return res.status(404).json({ message: "Task Component not found" });
    }
    res.status(200).json({ message: "Task Component deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  createTaskComponent,
  getAllTaskComponents,
  getTaskComponentById,
  updateTaskComponent,
  deleteTaskComponent,
  // Add any other functions you need here
};
