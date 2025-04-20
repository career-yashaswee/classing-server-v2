const mongoose = require("mongoose");

// Badge Schema
const badgeSchema = new mongoose.Schema(
  {
    badgeImage: {
      type: String, // URL to the badge image
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    impact: [
      {
        parameter: { type: String, required: true, trim: true },
        value: { type: mongoose.Schema.Types.Mixed, required: true }, // Can be number, string, or other data types
      },
    ],
  },
  { timestamps: true }
);

const badge = mongoose.model("Badge", badgeSchema);
module.exports = { badge };
