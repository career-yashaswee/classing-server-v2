import mongoose from "mongoose";

const schoolClassSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Class name
  //   location: { type: String, required: true } // Class location
});

// Export the Model
const SClass = mongoose.model("SchoolClass", schoolClassSchema);
export default SClass;

// JSON Format :
//
// {
//   "_id": "65c8d1f9e73a3d1a5c9f1b9i",
//   "id": "CLS101",
//   "name": "Grade 10 - Science"
// }
