import SocratesProb from "../schemas/socratesProbSchema/socratesProbSchema.js";

// Create a new SocratesProb
const createSocratesProb = async (req, res) => {
  try {
    const socratesProb = new SocratesProb(req.body);
    await socratesProb.save();
    res.status(201).json(socratesProb);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all SocratesProbs
const getAllSocratesProbs = async (req, res) => {
  try {
    const socratesProbs = await SocratesProb.find();
    res.status(200).json(socratesProbs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single SocratesProb by ID
const getSocratesProbById = async (req, res) => {
  try {
    const socratesProb = await SocratesProb.findById(req.params.id);
    if (!socratesProb) {
      return res.status(404).json({ message: "SocratesProb not found" });
    }
    res.status(200).json(socratesProb);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get SocratesProbs by Session ID
const getSocratesProbsBySessionID = async (req, res) => {
  try {
    const { sessionID } = req.params;
    const socratesProbs = await SocratesProb.find({ sessionID });
    res.status(200).json(socratesProbs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a SocratesProb
const updateSocratesProb = async (req, res) => {
  try {
    const socratesProb = await SocratesProb.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!socratesProb) {
      return res.status(404).json({ message: "SocratesProb not found" });
    }
    res.status(200).json(socratesProb);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a SocratesProb
const deleteSocratesProb = async (req, res) => {
  try {
    const socratesProb = await SocratesProb.findByIdAndDelete(req.params.id);
    if (!socratesProb) {
      return res.status(404).json({ message: "SocratesProb not found" });
    }
    res.status(200).json({ message: "SocratesProb deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createSocratesProb,
  getAllSocratesProbs,
  getSocratesProbById,
  getSocratesProbsBySessionID,
  updateSocratesProb,
  deleteSocratesProb,
};
