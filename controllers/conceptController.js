import mongoose from "mongoose";
import conceptSchema from "../schemas/conceptSchema/conceptSchema.js";

// Create Conecept Schema..
const createConcept = async (req, res) => {
  try {
    // Tak the Body..
    const concept = new conceptSchema(req.body);
    await concept.save(); // Saving the Concept of the file.
    res.status(201).json(concept);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllConcepts = async (req, res) => {
  try {
    const concepts = await conceptSchema.find(); // Finding all the Values.
    res.json(concepts); // Console.log() : ALl the JSON...
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all the Concepts by ID.
const getConceptById = async (req, res) => {
  try {
    const { id } = req.params;
    // Validate if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    const concept = await conceptSchema.findById(id);
    if (!concept) return res.status(404).json({ error: "Concept isn't Found" });
    // If the Concepts found the Value.
    res.status(200).json(concept);
  } catch (error) {
    res.status(500).json({ error: "Server Error: " + error.message });
  }
};

// Update Values By IDs
const updateConcept = async (req, res) => {
  try {
    const concept = await conceptSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    // If the Concept not Found.
    if (!concept) return res.status(404).json({ error: "Concept isn't Found" });
    res.json(concept);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Deleter the Concepts form the VAlues.
const deleteConcept = async (req, res) => {
  try {
    const concept = await conceptSchema.findByIdAndDelete(req.params.id);
    if (!concept) return res.status(404).json({ error: "Concept not found" });
    // If the Values are found.
    res.json({ message: "Concept deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Exporting all the Controllers.
export default {
  createConcept,
  getAllConcepts,
  getConceptById,
  updateConcept,
  deleteConcept,
};
