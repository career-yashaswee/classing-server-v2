import express from "express";
const router = express.Router();
import {
  createMission,
  getAllMissions,
  getMissionById,
  getMissionByMissionID,
  updateMission,
  deleteMission,
} from "../controllers/missionController.js";

// route-path Accordingly.
router.post("/", createMission);
router.get("/", getAllMissions);
router.get("/:id", getMissionById);
router.get("/missionid/:missionID", getMissionByMissionID);
router.put("/:id", updateMission);
router.delete("/:id", deleteMission);

// Exporting-Modules
export default router;
