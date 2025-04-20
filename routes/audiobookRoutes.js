import express from "express";
import audiobookController from "../controllers/audiobookController.js";
const router = express.Router();

// Route to create a new audiobook
router.post("/", audiobookController.createAudioBook);
// Route to get all audiobooks
router.get("/", audiobookController.getAllAudioBooks);
// Route to get a single audiobook by ID
router.get("/:id", audiobookController.getAudioBookById);
// Route to update an audiobook by ID
router.put("/:id", audiobookController.updateAudioBook);
// Route to delete an audiobook by ID
router.delete("/:id", audiobookController.deleteAudioBook);

export default router;
