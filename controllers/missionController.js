// Importing the Mission Schema.
import Mission from "../schemas/missionSchema/missionSchema.js";

// Importing the Controller CRED.

// create-mission
const createMission = async (req, res) => {
  try {
    const mission = new Mission(req.body);
    await mission.save();
    res.status(201).json(mission);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//get-all-missions
const getAllMissions = async (req, res) => {
  try {
    const missions = await Mission.find();
    res.status(200).json(missions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get-allmission-by-missionID
const getMissionById = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);
    if (!mission) {
      return res.status(404).json({ message: "Mission not found" });
    }
    res.status(200).json(mission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//mission-by-missionID
const getMissionByMissionID = async (req, res) => {
  try {
    const { missionID } = req.params;
    // Find the mission by missionID
    const mission = await Mission.find({ missionID });
    if (!mission) {
      return res.status(404).json({ message: "Mission not found" });
    }
    res.status(200).json(mission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//update-mission-byID
const updateMission = async (req, res) => {
  try {
    const mission = await Mission.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!mission) {
      return res.status(404).json({ message: "Mission not found" });
    }
    res.status(200).json(mission);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete-missions-byID
const deleteMission = async (req, res) => {
  try {
    const mission = await Mission.findByIdAndDelete(req.params.id);
    if (!mission) {
      return res.status(404).json({ message: "Mission not found" });
    }
    res.status(200).json({ message: "Mission deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createMission,
  getAllMissions,
  getMissionById,
  getMissionByMissionID,
  updateMission,
  deleteMission,
};
