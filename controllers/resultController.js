import Result from "../schemas/resultSchema/resultSchema.js";

// Create a new result
const createResult = async (req, res) => {
  try {
    const result = new Result(req.body);
    await result.save();
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all results
const getAllResults = async (req, res) => {
  try {
    const results = await Result.find();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get result by resultId
const getResultByResultId = async (req, res) => {
  try {
    const result = await Result.find({ resultId: req.params.resultId });
    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get result by studentId
const getResultByStudentId = async (req, res) => {
  try {
    const results = await Result.find({ studentId: req.params.studentId });
    if (!results.length) {
      return res
        .status(404)
        .json({ message: "No results found for this student" });
    }
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update result by resultId
const updateResult = async (req, res) => {
  try {
    const updated = await Result.findOneAndUpdate(
      { resultId: req.params.resultId },
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Result not found" });
    }
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete result by resultId
const deleteResult = async (req, res) => {
  try {
    const deleted = await Result.findOneAndDelete({
      resultId: req.params.resultId,
    });
    if (!deleted) {
      return res.status(404).json({ message: "Result not found" });
    }
    res.status(200).json({ message: "Result deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  createResult,
  getAllResults,
  getResultByResultId,
  getResultByStudentId,
  updateResult,
  deleteResult,
};
