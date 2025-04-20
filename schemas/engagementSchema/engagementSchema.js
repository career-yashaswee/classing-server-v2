import mongoose from "mongoose";

const engagementSchema = new mongoose.Schema(
  {
    grade: { type: Number, required: true }, // Grade level of the engagement
    subject: { type: String, required: true }, // Subject name
    course: { type: String, required: true }, // Course name
    engagementType: {
      type: String,
      enum: ["Quiz", "Assignment", "Video", "Interactive", "Reading", "Discussion"],
      required: true,
    }, // Type of engagement
    duration: { type: Number, required: true }, // Duration in minutes
    coverImage: { type: String, required: true }, // URL of cover image
    title: { type: String, required: true }, // Title of the engagement
    description: { type: String, required: true }, // Description of the engagement
    minAudience: { type: Number, required: true, default: 1 }, // Minimum number of participants required
    audienceType: {
      type: String,
      enum: ["GROUP", "INDIVIDUAL", "TEAM"],
      required: true,
    }, // Audience type
    venue: { type: String }, // Optional venue/location info
  },
  { timestamps: true }
);

const Engagement = mongoose.model("Engagement", engagementSchema);

export default Engagement;
