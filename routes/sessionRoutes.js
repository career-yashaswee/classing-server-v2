import express from "express";
const router = express.Router();
// Importing Session Controller
import sessionController from "../controllers/sessionController.js";


// CREATE Session // Checked and Corrected
router.post("/", sessionController.createSession);
// GET Session by ObjectID // Checked and Corrected
router.get("/:objectID", sessionController.getSessionById);

router.get("/:objectID/join", sessionController.getSessionById);
// UPDATE Session by ObjectID // Checked and Corrected
router.put("/:objectID", sessionController.updateSession);
// DELETE Session by ObjectID // Checked and Corrected
router.delete("/:objectID", sessionController.deleteSession);
// GET ALL Sessions // Checked and Corrected
router.get("/", sessionController.getAllSessions);
// GET Session by SClass ID
router.get("/sclass/:sclassId", sessionController.getSessionBySClassId);
// Route to get session by ObjectID and verify invite code
router.get("/invite/:inviteCode", sessionController.getSessionByInviteCode);

// Exports // Checked and Corrected
export default router;
