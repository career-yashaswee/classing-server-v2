import Exam from "../schemas/examSchema/examSchema.js";

// Create a new exam
const addExam = async (req, res) => {
  try {
    const exam = new Exam(req.body);
    await exam.save();
    res.status(201).json({ message: "Exam created successfully", exam });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Read - Get all exams
const getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find();
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read - Get an exam by examId
const getExamByExamId = async (req, res) => {
  try {
    const exam = await Exam.findOne({ examId: req.params.examId });
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    res.status(200).json(exam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an exam by examId
const updateExam = async (req, res) => {
  try {
    const exam = await Exam.findOneAndUpdate(
      { examId: req.params.examId },
      req.body,
      { new: true }
    );
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    res.status(200).json({ message: "Exam updated successfully", exam });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an exam by examId
const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findOneAndDelete({ examId: req.params.examId });
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    res.status(200).json({ message: "Exam deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  addExam,
  getAllExams,
  getExamByExamId,
  updateExam,
  deleteExam,
};
