import express from "express";
const router = express.Router();

import SClassController from "../controllers/SClassController.js";
// import SClass from "../schemas/SClassID/SClassID.js"; // Import the SchoolClass model

router.post("/", SClassController.createSchoolClass);

// Route to GET all School Classes
// router.get("/sclass", SClassController.getAllSchoolClasses);

// Route to GET a single School Class by ID
router.get("/:id", SClassController.getSchoolClassById);

// Route to UPDATE a School Class by ID
router.put("/:id", SClassController.updateSchoolClass);

// Route to DELETE a School Class by ID
router.delete("/:id", SClassController.deleteSchoolClass);

export default router;
