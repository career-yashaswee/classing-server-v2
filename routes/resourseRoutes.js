const express = require('express');
const router = express.Router();
const {
  createResource,
  getResourceById,
  getAllResources,
  updateResource,
  deleteResource
} = require('../controllers/resourseController');

// Create a new resource
router.post('/', createResource);
// Get a single resource by ID
router.get('/:id', getResourceById);
// Get all resources
router.get('/', getAllResources);
// Update a resource by ID
router.put('/reset/:id', updateResource);
// Delete a resource by ID
router.delete('/:id', deleteResource);

module.exports = router;