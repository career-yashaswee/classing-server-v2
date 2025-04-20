// Import Model of the Session.
import mongoose from "mongoose";
import Session from "../schemas/sessionSchema/sessionSchema.js";
import Student from "../schemas/studentSchema/studentSchema.js";

// CREATE Session
const createSession = async (req, res) => {
  try {
    const newSession = new Session(req.body);
    const savedSession = await newSession.save();
    res.status(201).json({ message: "Session Created", data: savedSession });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET Session by ObjectID
const getSessionById = async (req, res) => {
  try {
    const { objectID } = req.params;
    if (!mongoose.Types.ObjectId.isValid(objectID)) {
      return res.status(400).json({ error: "Invalid ObjectID" });
    }

    const session = await Session.findById(objectID);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// UPDATE Session by ObjectID
const updateSession = async (req, res) => {
  try {
    const { objectID } = req.params;
    if (!mongoose.Types.ObjectId.isValid(objectID)) {
      return res.status(400).json({ error: "Invalid ObjectID" });
    }

    const updatedSession = await Session.findByIdAndUpdate(objectID, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedSession) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.status(200).json({ message: "Session Updated", data: updatedSession });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE Session by ObjectID
const deleteSession = async (req, res) => {
  try {
    const { objectID } = req.params;
    if (!mongoose.Types.ObjectId.isValid(objectID)) {
      return res.status(400).json({ error: "Invalid ObjectID" });
    }

    const deletedSession = await Session.findByIdAndDelete(objectID);
    if (!deletedSession) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.status(200).json({ message: "Session Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// GET ALL Sessions
const getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find();
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// GET Session by SClassId
const getSessionBySClassId = async (req, res) => {
  try {
    const { sclassId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(sclassId)) {
      return res.status(400).json({ error: "Invalid ObjectID" });
    }

    const sessions = await Session.find({ SClass: sclassId });

    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// VERIFY SClass.
const verifySClassMatch = async (req, res) => {
  try {
    const { studentId, code, sessionId } = req.query; // Extracting from query params

    if (!studentId || !code || !sessionId) {
      return res
        .status(400)
        .json({ error: "Missing studentId, code, or sessionId" });
    }

    // Fetch student and session details using _id
    const student = await Student.findById(studentId);
    const session = await Session.findById(sessionId);

    if (!student || !session) {
      return res.status(404).json({ error: "Student or Session not found" });
    }

    // Check if invite code matches
    if (session.inviteCode !== code) {
      return res
        .status(403)
        .json({ error: "Invalid invite code!", allowed: false });
    }

    // Compare SClass IDs
    if (
      student.SClass &&
      session.SClass &&
      student.SClass.toString() === session.SClass.toString()
    ) {
      return res.status(200).json({
        message: "SClass ID matches and invite code is correct!",
        allowed: true,
      });
    } else {
      return res
        .status(403)
        .json({ error: "SClass ID mismatch!", allowed: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSessionByInviteCode = async (req, res) => {
  try {
    const { inviteCode } = req.params;

    const session = await Session.findOne({
      _id: objectID,
    });
    if (!session) {
      return res
        .status(404)
        .json({ error: "Session not found or incorrect invite code" });
    }
    res.status(200).json({
      message: "Session found",
      session,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// module.exports = { verifySClassMatch };

// Export all the Session.
export default {
  createSession,
  getSessionById,
  updateSession,
  deleteSession,
  getAllSessions,
  getSessionBySClassId,
  getSessionByInviteCode,
};
