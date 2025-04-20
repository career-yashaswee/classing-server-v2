import InterestCollection from "../schemas/interestCollectionSchema/interestCollectionSchema.js";

// Create a new Interest Collection
const createInterestCollection = async (req, res) => {
  try {
    const interestCollection = new InterestCollection(req.body);
    await interestCollection.save();
    res.status(201).json(interestCollection);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all Interest Collections
const getAllInterestCollections = async (req, res) => {
  try {
    const interestCollections = await InterestCollection.find();
    res.status(200).json(interestCollections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single Interest Collection by ID
const getInterestCollectionById = async (req, res) => {
  try {
    const interestCollection = await InterestCollection.findById(req.params.id);
    if (!interestCollection) {
      return res.status(404).json({ message: "Interest Collection not found" });
    }
    res.status(200).json(interestCollection);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all InterestCollection records by sessionId
const getInterestCollectionBySessionId = async (req, res) => {
  try {
    const interestCollections = await InterestCollection.find({ sessionId: req.params.sessionId });

    if (!interestCollections || interestCollections.length === 0) {
      return res.status(404).json({ message: "No interest collections found for this session" });
    }

    res.status(200).json(interestCollections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Update an Interest Collection
const updateInterestCollection = async (req, res) => {
  try {
    const interestCollection = await InterestCollection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!interestCollection) {
      return res.status(404).json({ message: "Interest Collection not found" });
    }
    res.status(200).json(interestCollection);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an Interest Collection
const deleteInterestCollection = async (req, res) => {
  try {
    const interestCollection = await InterestCollection.findByIdAndDelete(
      req.params.id
    );
    if (!interestCollection) {
      return res.status(404).json({ message: "Interest Collection not found" });
    }
    res
      .status(200)
      .json({ message: "Interest Collection deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  createInterestCollection,
  getAllInterestCollections,
  getInterestCollectionById,
  getInterestCollectionBySessionId,
  updateInterestCollection,
  deleteInterestCollection,
};
// Compare this snippet from src/index.js:
