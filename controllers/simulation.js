import Simulation from "../schemas/simulation/simulation.js";

// Create a new Simulation
const createSimulation = async (req, res) => {
  try {
    const simulation = new Simulation(req.body);
    await simulation.save();
    res.status(201).json(simulation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Read a Simulation by ID
const getSimulationById = async (req, res) => {
  try {
    const simulation = await Simulation.findById(req.params.id);
    if (!simulation)
      return res.status(404).json({ message: "Simulation not found" });
    res.json(simulation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read all Simulations
const getAllSimulations = async (req, res) => {
  try {
    const simulations = await Simulation.find();
    res.json(simulations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a Simulation by ID
const updateSimulation = async (req, res) => {
  try {
    const simulation = await Simulation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!simulation)
      return res.status(404).json({ message: "Simulation not found" });
    res.json(simulation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a Simulation by ID
const deleteSimulation = async (req, res) => {
  try {
    const simulation = await Simulation.findByIdAndDelete(req.params.id);
    if (!simulation)
      return res.status(404).json({ message: "Simulation not found" });
    res.json({ message: "Simulation deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createSimulation,
  getSimulationById,
  getAllSimulations,
  updateSimulation,
  deleteSimulation,
};
