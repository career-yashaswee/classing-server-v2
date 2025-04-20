import mongoose from "mongoose";
import Nudge from "../schemas/nudge/nudgeSchema.js";

// Create a new Nudge
const createNudge = async (req, res) => {
  try {
    const nudge = new Nudge(req.body);
    await nudge.save();
    res.status(201).json(nudge);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Read all Nudges
const getAllNudges = async (req, res) => {
  try {
    const nudges = await Nudge.find();
    res.status(200).json(nudges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read a single Nudge by ID
const getNudgeById = async (req, res) => {
  try {
    const nudge = await Nudge.findById(req.params.id);
    if (!nudge) return res.status(404).json({ message: "Nudge not found" });
    res.status(200).json(nudge);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a Nudge
const updateNudge = async (req, res) => {
  try {
    const nudge = await Nudge.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!nudge) return res.status(404).json({ message: "Nudge not found" });
    res.status(200).json(nudge);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a Nudge
const deleteNudge = async (req, res) => {
  try {
    const nudge = await Nudge.findByIdAndDelete(req.params.id);
    if (!nudge) return res.status(404).json({ message: "Nudge not found" });
    res.status(200).json({ message: "Nudge deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// by SessionID.
const getNudgeBySessionId = async (req, res) => {
  try {
    const nudges = await Nudge.find({ sessionId: req.params.sessionId });

    if (!nudges || nudges.length === 0) {
      return res.status(404).json({ message: "No Nudges found for this session" });
    }

    res.status(200).json(nudges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  createNudge,
  getAllNudges,
  getNudgeById,
  updateNudge,
  deleteNudge,
  getNudgeBySessionId,
  // Add any other functions you need to export
};

