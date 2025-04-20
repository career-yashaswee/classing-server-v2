import mongoose from "mongoose";
import Attention from "../schemas/attentionSchema/attentionSchema.js";

// Create a new record
const createAttention = async (req, res) => {
  try {
    const newAttention = new Attention(req.body);
    await newAttention.save();
    res.status(201).json(newAttention);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Read all records
const getAllAttention = async (req, res) => {
  try {
    const attentionRecords = await Attention.find();
    res.status(200).json(attentionRecords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read a single record by _id
const getAttentionById = async (req, res) => {
  try {
    const attentionRecord = await Attention.findById(req.params.id);
    if (!attentionRecord) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.status(200).json(attentionRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a record by _id
const updateAttention = async (req, res) => {
  try {
    const updatedAttention = await Attention.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedAttention) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.status(200).json(updatedAttention);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a record by _id
const deleteAttention = async (req, res) => {
  try {
    const deletedAttention = await Attention.findByIdAndDelete(req.params.id);
    if (!deletedAttention) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export the functions correctly
export  {
  createAttention,
  getAllAttention,
  getAttentionById,
  updateAttention,
  deleteAttention,
};
