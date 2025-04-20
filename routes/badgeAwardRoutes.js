import express from "express";
import {
  awardBadge,
  getAllBadgeAwards,
  getBadgesByStudentID,
  getStudentIDByBadgeID,
  deleteBadgeAward,
} from "../controllers/badgeAwardController.js";

const router = express.Router();

router.post("/", awardBadge);  // Award a badge
router.get("/", getAllBadgeAwards);  // Get all badge awards
router.get("/student/:studentID", getBadgesByStudentID);  // Get badges by student ID
router.get("/badge/:badgeID", getStudentIDByBadgeID);  // Get students by badge ID
router.delete("/:id", deleteBadgeAward);  // Delete a badge award

export default router;
