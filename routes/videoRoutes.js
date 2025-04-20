import express from "express";
// import express from "express";
import videoController from "../controllers/videoController.js";
const router = express.Router();

// Create a new video
router.post("/", videoController.createVideo);
// Get all videos
router.get("/", videoController.getAllVideos);
// Get a single video by ID
router.get("/:id", videoController.getVideoById);
// Update a video by ID
router.put("/:id", videoController.updateVideo);
// Delete a video by ID
router.delete("/:id", videoController.deleteVideo);
// Like a video
router.post("/:id/like", videoController.likeVideo);
// Dislike a video
router.post("/:id/dislike", videoController.dislikeVideo);

export default router;