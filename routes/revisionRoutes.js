import express from "express";
import {
  createRevision,
  getAllRevisions,
  getRevisionById,
  updateRevision,
  deleteRevision,
} from "../controllers/revisionController.js";

const router = express.Router();

router.post("/", createRevision);
router.get("/", getAllRevisions);
router.get("/:id", getRevisionById);
router.put("/:id", updateRevision);
router.delete("/:id", deleteRevision);

export default router;

