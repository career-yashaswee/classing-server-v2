import express from "express";
const router = express.Router();
// Importing Controllers.
import  { createActivity, getActivityById, updateActivity, deleteActivity, getAllActivities } from "../controllers/activityController.js";

// CREATE Activity // Checked and Corrected.
router.post("/", createActivity);
// GET Activity by ObjectID //  Checked and Corrected.
router.get("/:objectID", getActivityById);
// UPDATE Activity by ObjectID // Checked and Corrected.
router.put("/:objectID", updateActivity);
// DELETE Activity by ObjectID // Checked and Corrected.
router.delete("/:objectID", deleteActivity);
// GET ALL Activities // Checked and Corrected.
router.get("/", getAllActivities);

export default router;
