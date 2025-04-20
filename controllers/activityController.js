// Import Model of the Activity.
import mongoose from "mongoose";
import { Activity } from "../schemas/activitySchema/activitySchema.js";

// CREATE Activity
const createActivity = async (req, res) => {
  try {
    const newActivity = new Activity(req.body);
    // console.log(newActivity);
    const savedActivity = await newActivity.save();
    res.status(201).json({ message: "Activity Created", data: savedActivity });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET Activity by ObjectID (params.objectID)
const getActivityById = async (req, res) => {
  try {
    const { objectID } = req.params;
    if (!mongoose.Types.ObjectId.isValid(objectID)) {
      return res.status(400).json({ error: "Invalid ObjectID" });
    }

    const activity = await Activity.findById(objectID);
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// UPDATE Activity by ObjectID
const updateActivity = async (req, res) => {
  try {
    const { objectID } = req.params;
    if (!mongoose.Types.ObjectId.isValid(objectID)) {
      return res.status(400).json({ error: "Invalid ObjectID" });
    }

    const updatedActivity = await Activity.findByIdAndUpdate(
      objectID,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedActivity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    res
      .status(200)
      .json({ message: "Activity Updated", data: updatedActivity });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE Activity by ObjectID
const deleteActivity = async (req, res) => {
  try {
    const { objectID } = req.params;
    if (!mongoose.Types.ObjectId.isValid(objectID)) {
      return res.status(400).json({ error: "Invalid ObjectID" });
    }

    const deletedActivity = await Activity.findByIdAndDelete(objectID);
    if (!deletedActivity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    res.status(200).json({ message: "Activity Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// GET ALL Activities (Optional)
const getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find();
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export {
  createActivity,
  getActivityById,
  updateActivity,
  deleteActivity,
  getAllActivities,
};
// // Importing the Activity Model.