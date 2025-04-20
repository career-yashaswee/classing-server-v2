import Doubt from "../schemas/doubtSchema/doubtSchema.js";

const addDoubt = async (req, res) => {
  try {
    const { sessionId, studentId, doubtText, tags, collectionId } = req.body;
    const doubt = new Doubt({
      sessionId,
      studentId,
      doubtText,
      tags,
      collectionId,
      timestamp: new Date(),
    });
    await doubt.save();
    res.status(201).json(doubt);
  } catch (error) {
    res.status(500).json({ error: "Error saving doubt", details: error });
  }
};

const getDoubtsBySessionId = async (req, res) => {
  try {
    const doubts = await Doubt.find({ sessionId: req.params.sessionId });
    res.status(200).json(doubts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching doubts" });
  }
};

export { addDoubt, getDoubtsBySessionId };
