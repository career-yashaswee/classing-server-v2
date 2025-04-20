import express from 'express';
const router = express.Router();

import {
  createResponse,
  getResponseById,
  getAllResponses,
  updateResponse,
  deleteResponse
} from '../controllers/attentionAttemptController.js';
// Import the necessary functions from the controller

// Create a new response
router.post('/', createResponse);
// Get all responses
router.get('/', getAllResponses);
// Get a specific response by ID
router.get('/:id', getResponseById);
// Update a response by ID
router.put('/:id', updateResponse);
// Delete a response by ID
router.delete('/:id', deleteResponse);

export default router;
