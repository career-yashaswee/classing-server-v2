import express from "express";
const router = express.Router();

import {createAvatarSession, getAllAvatarSessions, getAvatarSessionById, updateAvatarSession, deleteAvatarSession, addMessageToSession} from "../controllers/avatarController.js";


router.post("/", createAvatarSession); // Create session
router.get("/", getAllAvatarSessions); // Get all sessions
router.get("/:id", getAvatarSessionById); // Get session by ID
router.put("/:id", updateAvatarSession); // Update session
router.delete("/:id", deleteAvatarSession); // Delete session
router.post("/:id/message", addMessageToSession); // Add message

export default router;
