import express from "express";
const router = express.Router();

import {
  createSocratesProb,
  getAllSocratesProbs,
  getSocratesProbById,
  getSocratesProbsBySessionID,
  updateSocratesProb,
  deleteSocratesProb,
} from "../controllers/socratesProbController.js";


// Routes
router.post("/", createSocratesProb);
router.get("/", getAllSocratesProbs);
router.get("/:id", getSocratesProbById);
router.get("/session/:sessionID", getSocratesProbsBySessionID);
router.put("/:id", updateSocratesProb);
router.delete("/:id", deleteSocratesProb);

export default router;
