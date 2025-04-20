import Engagement from "../schemas/engagementSchema/engagementSchema.js"; // Importing the Engagement model

// Create a new engagement
const createEngagement = async (req, res) => {
  try {
    const engagement = new Engagement(req.body);
    await engagement.save();
    res.status(201).json({ message: "Engagement created successfully", engagement });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all engagements
const getAllEngagements = async (req, res) => {
  try {
    const engagements = await Engagement.find();
    res.status(200).json(engagements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single engagement by ID
const getEngagementById = async (req, res) => {
  try {
    const engagement = await Engagement.findById(req.params.id);
    if (!engagement) {
      return res.status(404).json({ message: "Engagement not found" });
    }
    res.status(200).json(engagement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an engagement by ID
const updateEngagement = async (req, res) => {
  try {
    const engagement = await Engagement.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!engagement) {
      return res.status(404).json({ message: "Engagement not found" });
    }
    res.status(200).json({ message: "Engagement updated successfully", engagement });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an engagement by ID
const deleteEngagement = async (req, res) => {
  try {
    const engagement = await Engagement.findByIdAndDelete(req.params.id);
    if (!engagement) {
      return res.status(404).json({ message: "Engagement not found" });
    }
    res.status(200).json({ message: "Engagement deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  createEngagement,
  getAllEngagements,
  getEngagementById,
  updateEngagement,
  deleteEngagement,
  // Add any other engagement-related functions here
};
