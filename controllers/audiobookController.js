import AudioBook from "../schemas/audiobookSchema/audiobookSchema.js";

// Create a new audiobook
const createAudioBook = async (req, res) => {
  try {
    const audiobook = new AudioBook(req.body);
    await audiobook.save();
    res.status(201).json(audiobook);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all audiobooks
const getAllAudioBooks = async (req, res) => {
  try {
    const audiobooks = await AudioBook.find();
    res.status(200).json(audiobooks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single audiobook by ID
const getAudioBookById = async (req, res) => {
  try {
    const audiobook = await AudioBook.findById(req.params.id);
    if (!audiobook) {
      return res.status(404).json({ message: "Audiobook not found" });
    }
    res.status(200).json(audiobook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an audiobook by ID
const updateAudioBook = async (req, res) => {
  try {
    const audiobook = await AudioBook.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!audiobook) {
      return res.status(404).json({ message: "Audiobook not found" });
    }
    res.status(200).json(audiobook);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an audiobook by ID
const deleteAudioBook = async (req, res) => {
  try {
    const audiobook = await AudioBook.findByIdAndDelete(req.params.id);
    if (!audiobook) {
      return res.status(404).json({ message: "Audiobook not found" });
    }
    res.status(200).json({ message: "Audiobook deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  createAudioBook,
  getAllAudioBooks,
  getAudioBookById,
  updateAudioBook,
  deleteAudioBook,
  // Add any other methods you need here
};
