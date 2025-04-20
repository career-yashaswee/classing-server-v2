// Importing Revision-Schema
import Revision from "../schemas/revisionSchema/revisionSchema.js";


// create-revision
const createRevision = async (req, res) => {
  try {
    const newRevision = new Revision(req.body);
    const savedRevision = await newRevision.save();
    res.status(201).json(savedRevision);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// find-allRevisions
const getAllRevisions = async (req, res) => {
  try {
    const revisions = await Revision.find();
    res.status(200).json(revisions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get-allRevisions-byID
const getRevisionById = async (req, res) => {
  try {
    const revision = await Revision.findById(req.params.id);
    if (!revision) {
      return res.status(404).json({ message: "Revision isn't found" });
    }
    res.status(200).json(revision);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update-revision-byID
const updateRevision = async (req, res) => {
  try {
    const updatedRevision = await Revision.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedRevision) {
      return res.status(404).json({ message: "Revision isn't found" });
    }
    res.status(200).json(updatedRevision);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// delete-revision-byID
const deleteRevision = async (req, res) => {
  try {
    const deletedRevision = await Revision.findByIdAndDelete(req.params.id);
    if (!deletedRevision) {
      return res.status(404).json({ message: "Revision isn't found" });
    }
    res.status(200).json({ message: "Revision Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export: Exporting Modules
export {
    createRevision,
    getAllRevisions,
    getRevisionById,
    updateRevision,
    deleteRevision,
}