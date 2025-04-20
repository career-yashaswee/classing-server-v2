import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    // Have to change theile name to the Type of mongoose.Schema.Types.ObjectID.
    // Make the file Accordingly...
    username: {
      type: String, // MAke the file tyoe to the Object ID.
      required: true,
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    guardian: {
      permanentAddress: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
      },
      contactNumber: {
        type: String,
        required: true,
        trim: true,
        match: [/^\d{10}$/, "Invalid contact number"],
      },
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    school: {
      type: String,
      required: true,
      trim: true,
    },
    admissionNumber: {
      type: String,
      unique: true,
      sparse: true, // Allows null values but maintains uniqueness
    },
    SClass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SchoolClass",
    },
  },
  { timestamps: true }
);

const Student = mongoose.model("studentSchema", studentSchema);
export default Student;

// JSON Format :
//
// {
//   "_id": "64f8a7d8b5f2c3a1d4e5f6b7",
//   "username": "john_doe",
//   "fullName": "John Doe",
//   "guardian": {
//     "permanentAddress": "123 Main Street, City, Country",
//     "email": "guardian@example.com",
//     "contactNumber": "9876543210"
//   },
//   "dateOfBirth": "2005-08-15T00:00:00.000Z",
//   "gender": "Male",
//   "school": "Springfield High School",
//   "admissionNumber": "A12345",
//   "SClass": "64f8a7d8b5f2c3a1d4e5f6b8",
//   "createdAt": "2024-02-22T12:00:00.000Z",
//   "updatedAt": "2024-02-22T12:00:00.000Z",
//   "__v": 0
// }
