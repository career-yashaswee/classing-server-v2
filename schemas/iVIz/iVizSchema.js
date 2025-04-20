import mongoose from "mongoose";
import Author from "../userSchema/userSchema.js";

// tags: [
//       { name: "Data Structures", icon: "Tree" },
//       { name: "Algorithms", icon: "FlowChart" },
//       { name: "Binary Tree", icon: "Branch" },
//     ],
const tagSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, required: true },
});
//     author: {
//       name: "Prof. Rahul Verma",
//       avatar: "https://i.pravatar.cc/40?img=5",
//     },
const authorSchema = new mongoose.Schema({
  name: { type: mongoose.Schema.Types.ObjectId, ref: "UserSchema" },
  avatar: { type: String, required: true },
});

// {
//     id: 1,
//     title: "Visualizing Binary Search Trees",
//     description:
//       "Interactive visualization of Binary Search Trees, ideal for understanding search algorithms.",
//     thumbnail:
//       "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20221215114732/bst-21.png",
//
//     category: "Data Structures and Algorithms",
//
//     embedCount: 320,
//     license: "Creative Commons",
//     embedCode:
//       "<iframe src='https://example.com/binary-search-tree' width='100%' height='400'></iframe>",
//     version: "1.0.0",
//     rating: 4.7,
//     totalRatings: 540,
//     editorsChoice: true,
//     url: `http://localhost:3000/#json=AoqiIOIjflo2i3-_GXHw8,uLwZ9Fp--BhuxJfbDRAEWw`,
//   },
const visualizationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail: { type: String, required: true },
  tags: [tagSchema],
  category: { type: String, required: true },
  author: authorSchema,
  embedCount: { type: Number, required: true },
  license: { type: String, required: true },
  embedCode: { type: String, required: true },
  version: { type: String, required: true },
  rating: { type: Number, required: true },
  totalRatings: { type: Number, required: true },
  editorsChoice: { type: Boolean, required: true },
  url: { type: String, required: true },
}); // Requirments.

// Exporting the Vizualization Schema.
const Visualization = mongoose.model("Visualization", visualizationSchema);
export default Visualization;
