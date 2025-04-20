import express from "express";
import Task from "../schemas/taskSchema/taskSchema.js"; // Adjust the path as needed

// Create a new Task (Session with tasks)
const createTask = async (req, res) => {
  try {
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();
    res.status(201).json({ message: "Task created successfully", savedTask });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all tasks
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single task by sessionId
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a task by sessionId
const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task updated successfully", updatedTask });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a task by sessionId
const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Tasks by Session ID
const getAllTasksBySessionID = async (req, res) => {
  try {
    const { sessionId } = req.params; // Extract sessionId from request parameters
    // Find tasks by sessionId
    const tasks = await Task.find({ sessionId });
    if (!tasks) {
      return res
        .status(404)
        .json({ message: "No tasks found for this session ID" });
    }
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Import everything together as a single controller object in another file, like this:
// Import taskController from "../controllers/taskController.js";
export default {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getAllTasksBySessionID,
  // Add any other task-related functions here
}
