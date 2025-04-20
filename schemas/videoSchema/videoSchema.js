import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String, required: true }, // Video file URL
    thumbnail: { type: String, required: true }, // Thumbnail image URL
    duration: { type: Number, required: true }, // In seconds
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "UserSchema", required: true }, // Reference to User
    subject: { type: String, required: true }, // Educational Subject
    grade: { type: Number, required: true }, // Grade Level
    course: { type: String, required: true }, // Course Name
    tags: [{ type: String }], // Keywords for search
    category: { type: String, required: true }, // Category Reference
    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserSchema" }], // Array of User IDs who liked
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserSchema" }], // Array of User IDs who disliked
    isPublished: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Video = mongoose.model("Video", videoSchema);
export default Video;
