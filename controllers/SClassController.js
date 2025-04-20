import SClass from "../schemas/SClassID/SClassID.js"; // Import the SchoolClass model

// CREATE a new School Class
const createSchoolClass = async (req, res) => {
  try {
    const { name } = req.body;
    const newSchoolClass = new SClass({ name });
    const savedClass = await newSchoolClass.save();
    res.status(201).json(savedClass);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET all School Classes
// exports.getAllSchoolClasses = async (req, res) => {
//     try {
//       console.log("Fetching all school classes..."); // Debugging log
//       const classes = await SClass.find();
//       if (!classes || classes.length === 0) {
//         return res.status(404).json({ message: "No school classes found" });
//       }
//       res.status(200).json(classes);
//     } catch (error) {
//       console.error("Error fetching school classes:", error.message); // Debugging log
//       res.status(500).json({ error: error.message });
//     }
// };

// GET a single School Class by ID
const getSchoolClassById = async (req, res) => {
  try {
    const schoolClass = await SClass.findById(req.params.id);
    if (!schoolClass) {
      return res.status(404).json({ message: "School Class not found" });
    }
    res.status(200).json(schoolClass);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE a School Class by ID
const updateSchoolClass = async (req, res) => {
  try {
    const updatedClass = await SClass.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return the updated document
        runValidators: true, // Validate the updated fields
      }
    );

    if (!updatedClass) {
      return res.status(404).json({ message: "School Class not found" });
    }
    res.status(200).json(updatedClass);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE a School Class by ID
const deleteSchoolClass = async (req, res) => {
  try {
    const deletedClass = await SClass.findByIdAndDelete(req.params.id);
    if (!deletedClass) {
      return res.status(404).json({ message: "School Class not found" });
    }
    res.status(200).json({ message: "School Class deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  createSchoolClass,
  getSchoolClassById,
  updateSchoolClass,
  deleteSchoolClass,
};
