import Leaderboard from "../schemas/leaderboardSchema/leaderboardSchema.js";

// Create a new leaderboard
const createLeaderboard = async (req, res) => {
  try {
    const leaderboard = new Leaderboard(req.body);
    await leaderboard.save();
    res.status(201).json({ message: "Leaderboard created successfully", leaderboard });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all leaderboards
const getAllLeaderboards = async (req, res) => {
  try {
    const leaderboards = await Leaderboard.find().populate("SClassID").populate("leaderboardItems.studentID");
    res.status(200).json(leaderboards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a leaderboard by ID
const getLeaderboardById = async (req, res) => {
  try {
    const leaderboard = await Leaderboard.findById(req.params.id).populate("SClassID").populate("leaderboardItems.studentID");
    if (!leaderboard) {
      return res.status(404).json({ message: "Leaderboard not found" });
    }
    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a leaderboard
const updateLeaderboard = async (req, res) => {
  try {
    const updatedLeaderboard = await Leaderboard.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate("SClassID");
    if (!updatedLeaderboard) {
      return res.status(404).json({ message: "Leaderboard not found" });
    }
    res.status(200).json({ message: "Leaderboard updated successfully", updatedLeaderboard });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a leaderboard
const deleteLeaderboard = async (req, res) => {
  try {
    const deletedLeaderboard = await Leaderboard.findByIdAndDelete(req.params.id);
    if (!deletedLeaderboard) {
      return res.status(404).json({ message: "Leaderboard not found" });
    }
    res.status(200).json({ message: "Leaderboard deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get leaderboard by SClassID
const getLeaderboardBySClassID = async (req, res) => {
  try {
    const leaderboards = await Leaderboard.find({ SClassID: req.params.sclassID }).populate("SClassID").populate("leaderboardItems.studentID");
    if (!leaderboards.length) {
      return res.status(404).json({ message: "No leaderboards found for this class" });
    }
    res.status(200).json(leaderboards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get leaderboard items by LeaderboardID
const getLeaderboardItemsByLeaderboardID = async (req, res) => {
  try {
    const leaderboard = await Leaderboard.findById(req.params.leaderboardID).populate("leaderboardItems.studentID");
    if (!leaderboard) {
      return res.status(404).json({ message: "Leaderboard not found" });
    }
    res.status(200).json(leaderboard.leaderboardItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  createLeaderboard,
  getAllLeaderboards,
  getLeaderboardById,
  updateLeaderboard,
  deleteLeaderboard,
  getLeaderboardBySClassID,
  getLeaderboardItemsByLeaderboardID,
};