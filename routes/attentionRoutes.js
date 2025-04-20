import express from "express";
const router = express.Router();

import {
  createAttention,
  getAllAttention,
  getAttentionById,
  updateAttention,
  deleteAttention,
} from "../controllers/attentionController.js";

// Create a new record
router.post("/", createAttention);
// Get all records
router.get("/", getAllAttention);
// Get a single record by _id
router.get("/:id", getAttentionById);
// Update a record by _id
router.put("/:id", updateAttention);
// Delete a record by _id
router.delete("/:id", deleteAttention);

export default router;
