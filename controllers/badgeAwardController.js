import { BadgeAward } from "../schemas/badgeAwardSchema/badgeAwardSchema.js";

// Create a new badge award
const awardBadge = async (req, res) => {
  try {
    const { badge, studentID, title, description, awardee } = req.body;

    const newBadgeAward = new BadgeAward({
      badge,
      studentID,
      title,
      description,
      awardee,
    });

    await newBadgeAward.save();
    res.status(201).json({ message: "Badge awarded successfully!", data: newBadgeAward });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all badge awards
const getAllBadgeAwards = async (req, res) => {
  try {
    const badgeAwards = await BadgeAward.find().populate("badge studentID awardee");
    res.status(200).json(badgeAwards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get badges by student ID
const getBadgesByStudentID = async (req, res) => {
  try {
    const { studentID } = req.params;
    const badges = await BadgeAward.find({ studentID }).populate("badge");
    
    if (!badges.length) {
      return res.status(404).json({ message: "No badges found for this student." });
    }

    res.status(200).json(badges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get students by badge ID
const getStudentIDByBadgeID = async (req, res) => {
  try {
    const { badgeID } = req.params;
    const students = await BadgeAward.find({ badge: badgeID }).populate("studentID");

    if (!students.length) {
      return res.status(404).json({ message: "No students found for this badge." });
    }

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a badge award
const deleteBadgeAward = async (req, res) => {
  try {
    const { id } = req.params;
    const badgeAward = await BadgeAward.findByIdAndDelete(id);

    if (!badgeAward) {
      return res.status(404).json({ message: "Badge award not found." });
    }

    res.status(200).json({ message: "Badge award deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  awardBadge,
  getAllBadgeAwards,
  getBadgesByStudentID,
  getStudentIDByBadgeID,
  deleteBadgeAward,
};
