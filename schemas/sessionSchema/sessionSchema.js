import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: [200, "Length can't be more than 200"],
    },
    duration: {
      type: Number,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    SClass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SchoolClass",
      required: true,
    },
    topic_tags: {
      type: [String],
      required: true,
    },
    focus: {
      type: String,
      required: true,
      enum: ["example_intensive", "conceptual", "practical"],
    },
    session_start_time: {
      type: String,
      required: true,
      default: () =>
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    session_start_date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    inviteCode: {
      type: String,
      required: true,
      default: function () {
        return Math.random().toString(36).substring(2, 6).toUpperCase();
      },
      validate: {
        validator: function (v) {
          return /^[A-Za-z]{4}$/.test(v); // Ensures only 4 alphabetic characters
        },
        message:
          "Invite code must be exactly 4 alphabetic characters (A-Z, a-z).",
      },
    },
    URL: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^(https?:\/\/)/i.test(v); // Allows any valid URL starting with http or https
        },
        message: "URL must be a valid link starting with http or https.",
      },
    },
    topics: {
      type: [
        {
          id: { type: Number, required: true },
          title: { type: String, required: true },
          covered: { type: Boolean, required: true },
        },
      ],
      required: true,
    },
    __v: {
      type: Number,
      select: false, // Hides __v field by default in queries
    },
  },
  { timestamps: true }
);

const Session = mongoose.model("Session", sessionSchema);
export default Session;

// JSON Format :
//
// {
//   "_id": "65c8d1f9e73a3d1a5c9f1b9i",
//   "title": "Introduction to Algebra",
//   "subject": "Mathematics",
//   "description": "This session will cover the basics of algebra, including equations and expressions.",
//   "duration": 60,
//   "course": "Basic Algebra",
//   "SClass": "65c8d1f9e73a3d1a5c9f1b9j",
//   "topic_tags": ["Algebra", "Equations", "Expressions"],
//   "focus": "conceptual",
//   "session_start_time": "10:30 AM",
//   "session_start_date": "2025-02-22T00:00:00.000Z",
//   "inviteCode": "ABCD",
//   "createdAt": "2025-02-22T08:00:00.000Z",
//   "updatedAt": "2025-02-22T08:00:00.000Z"
// }
