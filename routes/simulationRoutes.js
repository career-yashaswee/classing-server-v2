const express = require("express");
const router = express.Router();
const {
  createSimulation,
  getSimulationById,
  getAllSimulations,
  updateSimulation,
  deleteSimulation,
} = require("../controllers/simulationController");

// Routes
router.post("/", createSimulation);
router.get("/", getAllSimulations);
router.get("/:id", getSimulationById);
router.put(":id", updateSimulation);
router.delete("/reset/:id", deleteSimulation);

module.exports = router;
