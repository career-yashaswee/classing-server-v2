import express from "express";
const router = express.Router();
import taskController from "../controllers/taskController.js"; // Adjust the path as needed

router.post("/", taskController.createTask); // Create the Post.
router.get("/", taskController.getAllTasks); // Collect the Post.
router.get("/:id", taskController.getTaskById); // Get task by ID.
router.put("/:id", taskController.updateTask); // Update the Task by ID.
router.delete("/:id", taskController.deleteTask); // Delete the Task.
router.get("/session/:sessionId", taskController.getAllTasksBySessionID);

export default router;
