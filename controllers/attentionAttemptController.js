import mongoose from 'mongoose';
import Response from '../schemas/attentionAttempt/attentionAttempt.js';

// Create a new Response
const createResponse = async (req, res) => {
  try {
    const response = new Response(req.body);
    await response.save();
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a Response by ID
const getResponseById = async (req, res) => {
  try {
    const response = await Response.findById(req.params.id).populate('studentID');
    if (!response) return res.status(404).json({ message: 'Response not found' });
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all Responses
const getAllResponses = async (req, res) => {
  try {
    const responses = await Response.find().populate('studentID');
    res.json(responses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a Response by ID
const updateResponse = async (req, res) => {
  try {
    const response = await Response.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!response) return res.status(404).json({ message: 'Response not found' });
    res.json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a Response by ID
const deleteResponse = async (req, res) => {
  try {
    const response = await Response.findByIdAndDelete(req.params.id);
    if (!response) return res.status(404).json({ message: 'Response not found' });
    res.json({ message: 'Response deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createResponse,
  getResponseById,
  getAllResponses,
  updateResponse,
  deleteResponse
};
