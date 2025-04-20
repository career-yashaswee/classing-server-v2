import mongoose from "mongoose";

// Custom validator to ensure at least one action is provided
function arrayLimit(val) {
  return val.length > 0;
}

const activityCollectionSchema = new mongoose.Schema(
  {
    // automaticMaking: "_id": ObjectId("65c8d1f9e73a3d1a5c9f1b4c")
    // "title": "Student Missed Attention Check"
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters long"],
      maxlength: [100, "Title-length is OutOfBound"],
    },
    category: {
      type: String,
      required: [true, "Category required for Title"],
      enum: ["student_engagement", "class_nudge", "alerts"],
    },
    sub_category: {
      type: String,
      required: true,
      enum: ["administration", "managemnet"],
    },
    description: {
      type: String,
      required: [true, "Description required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    severity: {
      type: Number,
      required: true,
      min: [1, "Severity must be between 1 & 10"],
      max: [10, "Severity must be between 1 & 10"],
      // enum: ["1-4", "5-7", "8-10"],
    },
    triggered_by: {
      id: {
        type: mongoose.Schema.Types.ObjectId, // Object_ID of User to be Referenced.
        ref: "UserSchema",
        required: [true, "Triggered ID required"],
      },
    },
    sent_to: {
      id: {
        type: mongoose.Schema.Types.ObjectId, // Object_ID of User to be Referenced.
        ref: "UserSchema",
        required: [true, "sent_to ID required"],
      },
    },
    // Date required from Default.
    date: {
      type: Date,
      default: Date.now, // Give the Changes of the Date Automatically.
      // Date will be dated automatically.
      required: [true],
      validate: {
        validator: function (value) {
          return value instanceof Date && !isNaN(value);
        },
        message: "Invalid date format",
      },
    },
    // Time will be Requred Automatically.
    time: {
      type: String,
      required: [true, "Time is required"],
      validate: {
        validator: function (value) {
          return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(value);
        },
        message: "Invalid time format (HH:MM:SS expected)",
      },
    },
    actions: {
      type: [
        {
          action_id: {
            type: String,
            required: [true, "Action ID required"],
          },
          url: {
            type: String,
            required: [true, "URL is required"],
            validate: {
              validator: function (value) {
                return /^https?:\/\/[^\s$.?#].[^\s]*$/.test(value);
              },
              message: "!! Invalid URL",
            },
          },
        },
      ],
      validate: [arrayLimit, "Validate URL"],
    },
    contact: {
      type: String,
      required: [true, "Contact number is required"],
      validate: {
        validator: function (value) {
          return /^\+?[0-9]{10,15}$/.test(value);
        },
        message: "Invalid contact number format",
      },
    },
  },
  { timestamps: true }
);

// Model Export.
const Activity = mongoose.model(
  "activityCollectionSchema",
  activityCollectionSchema
);
export { Activity }; // Exporting the Activity;


// JSON Format : 
// 
// {
//   "title": "Student Missed Attention Check",
//   "category": "student_engagement",
//   "sub_category": "administration",
//   "description": "The student did not respond to the attention check during class.",
//   "severity": 5,
//   "triggered_by": {
//     "id": "65c8d1f9e73a3d1a5c9f1b4c"
//   },
//   "sent_to": {
//     "id": "65c8d1f9e73a3d1a5c9f1b5d"
//   },
//   "date": "2025-02-22T10:30:00.000Z",
//   "time": "10:30:00",
//   "actions": [
//     {
//       "action_id": "A12345",
//       "url": "https://example.com/action1"
//     },
//     {
//       "action_id": "A67890",
//       "url": "https://example.com/action2"
//     }
//   ],
//   "contact": "+1234567890",
//   "createdAt": "2025-02-22T10:30:00.000Z",
//   "updatedAt": "2025-02-22T10:30:00.000Z"
// }
