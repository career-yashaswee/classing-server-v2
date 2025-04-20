import express from "express";
const router = express.Router();

import doubtCollectionController from "../controllers/doubtCollectionController.js";
// import { authenticate } from "../middleware/authMiddleware.js";

router.post("/create", doubtCollectionController.createDoubtCollection);
// router.get("/", doubtCollectionController.getAllDoubtCollections);
router.get("/:id", doubtCollectionController.getDoubtCollectionById);
router.put("/:id", doubtCollectionController.updateDoubtCollection);
router.delete("/:id", doubtCollectionController.deleteDoubtCollection);
router.get(
  "/session/:sessionID",
  doubtCollectionController.getAllDoubtCollectionsBySessionID
);

export default router;
