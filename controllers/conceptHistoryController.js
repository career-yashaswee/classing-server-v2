// Importing concept-history Schema.
import ConceptHistory from "../schemas/conceptHistorySchema/conceptHistorySchema.js";

// create-concept-history
const createConceptHistory = async (req, res) => {
  try {
    const newConceptHistory = new ConceptHistory(req.body);
    const savedConcept = await newConceptHistory.save();
    res.status(201).json(savedConcept);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get-all-concepts-byHistory
const getAllConceptHistories = async (req, res) => {
  try {
    // Find all the Values by History.
    const conceptHistories = await ConceptHistory.find();
    res.status(200).json(conceptHistories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get-allConcept-by-HistoryID
const getConceptHistoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const conceptHistory = await ConceptHistory.findById(id);
    if (!conceptHistory) {
      return res.status(404).json({ message: "Concept history not found" });
    }
    res.status(200).json(conceptHistory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//update-concept-byHistoryID
const updateConceptHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedConcept = await ConceptHistory.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedConcept) {
      return res.status(404).json({ message: "Concept history isn't found" });
    }
    res.status(200).json(updatedConcept);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//delete-concept-History-byID
const deleteConceptHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedConcept = await ConceptHistory.findByIdAndDelete(id);

    if (!deletedConcept) {
      return res.status(404).json({ message: "Concept history isn't found" });
    }
    res.status(200).json({ message: "Concept-History Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export all the models
export {
  createConceptHistory,
  getAllConceptHistories,
  getConceptHistoryById,
  updateConceptHistory,
  deleteConceptHistory,
};
