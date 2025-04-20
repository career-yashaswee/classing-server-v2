import mongoose from "mongoose";
import Visualization from "../schemas/iVIz/iVizSchema.js"; // Ensure the correct path

// Create a new visualization
const createVisualization = async (req, res) => {
  try {
    const newVisualization = new Visualization(req.body);
    await newVisualization.save();
    res.status(201).json({
      message: "Visualization created successfully",
      data: newVisualization,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a visualization by ID
const getVisualizationById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ObjectId" });
    }
    const visualization = await Visualization.findById(id);
    if (!visualization) {
      return res.status(404).json({ error: "Visualization not found" });
    }
    res.status(200).json(visualization);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a visualization by ID
const updateVisualization = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ObjectId" });
    }
    const updatedVisualization = await Visualization.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (!updatedVisualization) {
      return res.status(404).json({ error: "Visualization not found" });
    }
    res.status(200).json({
      message: "Visualization updated successfully",
      data: updatedVisualization,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a visualization by ID
const deleteVisualization = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ObjectId" });
    }
    const deletedVisualization = await Visualization.findByIdAndDelete(id);
    if (!deletedVisualization) {
      return res.status(404).json({ error: "Visualization not found" });
    }
    res.status(200).json({ message: "Visualization deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllVisualizations = async (req, res) => {
  try {
    const visualizations = await Visualization.find();
    res.status(200).json(visualizations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createVisualization,
  getVisualizationById,
  updateVisualization,
  deleteVisualization,
  getAllVisualizations,
}
