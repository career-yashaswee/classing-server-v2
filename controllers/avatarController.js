import AvatarSession from "../schemas/avatarSchema/avatarSchema.js"; // Ensure correct path

// CREATE a new Avatar Session
const createAvatarSession = async (req, res) => {
  try {
    const { userId, sessionId, conversation } = req.body;
    const newSession = new AvatarSession({ userId, sessionId, conversation });
    const savedSession = await newSession.save();
    res.status(201).json(savedSession);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET all Avatar Sessions
const getAllAvatarSessions = async (req, res) => {
  try {
    const sessions = await AvatarSession.find();
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET a single Avatar Session by ID
const getAvatarSessionById = async (req, res) => {
  try {
    const session = await AvatarSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: "Avatar Session not found" });
    }
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE an Avatar Session by ID
const updateAvatarSession = async (req, res) => {
  try {
    const updatedSession = await AvatarSession.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedSession) {
      return res.status(404).json({ message: "Avatar Session not found" });
    }
    res.status(200).json(updatedSession);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE an Avatar Session by ID
const deleteAvatarSession = async (req, res) => {
  try {
    const deletedSession = await AvatarSession.findByIdAndDelete(req.params.id);
    if (!deletedSession) {
      return res.status(404).json({ message: "Avatar Session not found" });
    }
    res.status(200).json({ message: "Avatar Session deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ADD a Message to an Existing Avatar Session
const addMessageToSession = async (req, res) => {
  try {
    const { messageId, sender, text, timestamp } = req.body;

    const session = await AvatarSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: "Avatar Session not found" });
    }

    session.conversation.push({ messageId, sender, text, timestamp });
    const updatedSession = await session.save();
    
    res.status(200).json(updatedSession);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export {
  createAvatarSession,
  getAllAvatarSessions,
  getAvatarSessionById,
  updateAvatarSession,
  deleteAvatarSession,
  addMessageToSession,
}
