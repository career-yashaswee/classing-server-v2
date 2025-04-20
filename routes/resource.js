import express from "express";
const router = express.Router();

import {
  createResource,
  getResourceById,
  getAllResources,
  updateResource,
  deleteResource,
} from "../controllers/resource.js";
// Import the resource controller functions

// Create a new resource
router.post("/", createResource);
// Get a single resource by ID
router.get("/:id", getResourceById);
// Get all resources
router.get("/", getAllResources);
// Update a resource by ID
router.put("/reset/:id", updateResource);
// Delete a resource by ID
router.delete("/:id", deleteResource);

export default router;
