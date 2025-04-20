import mongoose from "mongoose";

const conceptSchema = new mongoose.Schema(
  {
    // Not needed: Since, MongoDB generates the ID automatically...

    // id: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    assets: [
      {
        title: {
          type: String,
          required: true,
        },
        URL: {
          type: String,
          required: true,
        },
        tag: [
          {
            type: String,
          },
        ],
      },
    ],
    related: [
      {
        title: {
          type: String,
          required: true,
        },
        URL: {
          type: String,
          required: true,
        },
        tag: [
          {
            type: String,
          },
        ],
      },
    ],
    cover: {
      type: String,
      required: true,
    },
    tags: [{
        type: String,
    }],
  },
  { timestamps: true } // For the CreatedAt and
);

// Exporting the Concept Schema
const Concept = mongoose.model("ConceptSchema", conceptSchema);
export default Concept;
