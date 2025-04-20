import DoubtCollection from "../schemas/doubtCollectionSchema/doubtCollectionSchema.js";
import DoubtCollectionItem from "../schemas/doubtCollectionSchema/doubtCollectionItemSchema.js";

// CREATE a doubt collection for all students
const createDoubtCollection = async (req, res) => {
  try {
    const { tackled, doubts, sessionID } = req.body;
    // Ensure doubts array contains valid documents
    const savedDoubts = await Promise.all(
      doubts.map(async (doubt) => {
        const newDoubtItem = new DoubtCollectionItem(doubt);
        return await newDoubtItem.save();
      })
    );
    // Create a new doubt collection with references
    const newDoubtCollection = new DoubtCollection({
      tackled,
      doubts: savedDoubts.map((d) => d._id),
      sessionID,
    });
    const savedCollection = await newDoubtCollection.save();
    res.status(201).json(savedCollection);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET all doubt collections.
// exports.getAllDoubtCollections = async (req, res) => {
//     try {
//       const doubtCollections = await DoubtCollection.find();
//       res.status(200).json(doubtCollections);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
// };

const getDoubtCollectionById = async (req, res) => {
  try {
    const doubtCollection = await DoubtCollection.findById(
      req.params.id
    ).populate("doubts");
    if (!doubtCollection) {
      return res.status(404).json({ message: "Doubt Collection not found" });
    }
    res.status(200).json(doubtCollection);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE a doubt collection by ID
const updateDoubtCollection = async (req, res) => {
  try {
    const updatedCollection = await DoubtCollection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCollection) {
      return res.status(404).json({ message: "Doubt Collection not found" });
    }
    res.status(200).json(updatedCollection);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE a doubt collection by ID
const deleteDoubtCollection = async (req, res) => {
  try {
    const deletedCollection = await DoubtCollection.findByIdAndDelete(
      req.params.id
    );
    if (!deletedCollection) {
      return res.status(404).json({ message: "Doubt Collection not found" });
    }
    res.status(200).json({ message: "Doubt Collection deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 
const getAllDoubtCollectionsBySessionID = async (req, res) => {
  try {
    const { sessionID } = req.params;

    const doubtCollections = await DoubtCollection.find({ sessionID }).populate(
      "doubts"
    );
    if (!doubtCollections || doubtCollections.length === 0) {
      return res
        .status(404)
        .json({ message: "No Doubt Collections found for this session" });
    }
    res.status(200).json(doubtCollections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  createDoubtCollection,
  getDoubtCollectionById,
  updateDoubtCollection,
  deleteDoubtCollection,
  getAllDoubtCollectionsBySessionID,
  // getAllDoubtCollections
};