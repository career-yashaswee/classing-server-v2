import mongoose from "mongoose";

const audiobookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, index: true },
    author: { type: String, required: true },
    narrator: { type: String, required: true },
    publisher: { type: String },
    releaseDate: { type: Date },
    language: { type: String, required: true },
    genre: { type: String, required: true },
    tags: [{ type: String }], // Array of tags
    coverImage: { type: String }, // URL of cover image
    description: { type: String },

    audioDetails: {
      duration: { type: Number, required: true }, // in minutes
      fileFormat: {
        type: String,
        enum: ["mp3", "aac", "wav", "flac"],
        required: true,
      },
      sampleClip: { type: String , required: true }, // URL to a short preview
      chapters: [
        {
          title: { type: String, required: true },
          duration: { type: Number, required: true }, // in minutes
          audioFile: { type: String, required: true }, // URL to audio file
        },
      ],
    },

    ratings: {
      averageRating: { type: Number, default: 0, min: 0, max: 5 },
      totalReviews: { type: Number, default: 0 },
    },

    engagement: {
      totalListens: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const AudioBook = mongoose.model("AudioBook", audiobookSchema);
export default AudioBook;
