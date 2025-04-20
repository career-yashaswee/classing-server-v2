import express from "express";
const router = express.Router();
import kanbanController from "../controllers/kanbanController.js";

// Define CRUD routes
router.post("/tasks", kanbanController.createTask); // Create tasks
router.get("/tasks", kanbanController.getAllTasks); // Read all tasks
router.get("/tasks/:id", kanbanController.getTaskById); // Read one tasks
router.put("/tasks/:id", kanbanController.updateTask); // Update tasks
router.delete("/tasks/:id", kanbanController.deleteTask); // Delete tasks

export default router;
// Add any other routes you need here
