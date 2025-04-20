import express from "express";
const router = express.Router();
import { saveSettings, getSettings, deleteSettings } from "../controllers/settingController.js";

router.post("/", saveSettings); // Create or update settings
router.get("/:userID", getSettings); // Get settings by userID
router.delete("/:userID", deleteSettings); // Delete settings by userID

export default router;
// Compare this snippet from src/index.js:
