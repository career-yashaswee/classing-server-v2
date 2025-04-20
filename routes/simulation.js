import express from "express";
const router = express.Router();
// Simulation Routes
import {
  createSimulation,
  getSimulationById,
  getAllSimulations,
  updateSimulation,
  deleteSimulation,
} from "../controllers/simulation.js";

// Routes
router.post("/", createSimulation);
router.get("/", getAllSimulations);
router.get("/:id", getSimulationById);
router.put(":id", updateSimulation);
router.delete("/reset/:id", deleteSimulation);

export default router;
