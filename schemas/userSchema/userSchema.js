import mongoose from "mongoose";
// Give the userSchema.
const UserSchema = new mongoose.Schema(
  {
    // Name of Student/Teacher.
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["Student", "Teacher", "Admin", "System"],
      required: [true, "User role is required"],
    },
    contact: {
      type: String,
      match: [/^\+?\d{10,15}$/, "Invalid contact number"],
      required: false, // Optional field
    },
    mailID: {
      type: String,
      required: [true, "Email required"],
      unique: true, // Ensures no duplicate emails
      lowercase: true, // Converts email to lowercase
      trim: true, // Removes spaces before/after
      validate: {
        validator: function (value) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Invalid email Format.",
      },
    },
  },
  { timestamps: true }
);

const UserSchemaSchema = mongoose.model("UserSchema", UserSchema);
export default UserSchemaSchema;

// JSON Format : 
//
// {
//   "_id": "65d7c2e9f4a9b3c1e8b7d9f3",
//   "name": "John Doe",
//   "role": "Teacher",
//   "contact": "+919876543210",
//   "mailID": "johndoe@example.com",
//   "createdAt": "2024-02-22T12:00:00.000Z",
//   "updatedAt": "2024-02-22T12:00:00.000Z",
//   "__v": 0
// }
