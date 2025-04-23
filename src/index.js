import dotenv from "dotenv";
dotenv.config(); // Load environment variables
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import activityCollectionRoutes from "../routes/activityRoutes.js";
import sessionRoutes from "../routes/sessionRoutes.js";
import doubtRoutes from "../routes/doubtRoutes.js";
import iVizRoutes from "../routes/iVizRoutes.js";
import avatarRoutes from "../routes/avatarRoutes.js";
import taskRoutes from "../routes/taskRoutes.js";
import sclassRoutes from "../routes/sclassRoutes.js";
import chatRoutes from "../routes/chatRoutes.js";
import settingRoutes from "../routes/settingRoutes.js";
import kanbanRoutes from "../routes/kanbanRoutes.js";
import attentionRoutes from "../routes/attentionRoutes.js";
import deckRoutes from "../routes/deck.js";
import quizRoutes from "../routes/quiz.js";
import deckFCRoutes from "../routes/deckFCRoutes.js";
import flashCard from "../routes/flashCardRoutes.js";
import socratesProb from "../routes/socratesProbRoutes.js";
import interestCollection from "../routes/interestCollectionRoutes.js";
import attentionAttemptRoutes from "../routes/attentionAttemptRoutes.js";
import simulationRoutes from "../routes/simulation.js";
import resourceRoutes from "../routes/resource.js";
import nudgeRoutes from "../routes/nudgeRoutes.js";
import doubtCollectionRoutes from "../routes/doubtCollectionRoutes.js";
import leaderboardRoutes from "../routes/leaderboardRoutes.js";
import engagementRoutes from "../routes/engagementRoutes.js";
import badgeRoutes from "../routes/badgeAwardRoutes.js";
import audiobookRoutes from "../routes/audiobookRoutes.js";
import videoRoutes from "../routes/videoRoutes.js";
import taskComponentRoutes from "../routes/taskComponentsRoutes.js";
import taskSubmissionRoutes from "../routes/taskSubmissionRoutes.js";
import conceptRoutes from "../routes/conceptRoutes.js";
import conceptHistoryRoutes from "../routes/conceptHistoryRoutes.js";
import revisionRoutes from "../routes/revisionRoutes.js";
import missionRoutes from "../routes/missionRoutes.js";
import examRoutes from "../routes/examRoutes.js";
import resultRoutes from "../routes/resultRoutes.js";

import socketConnection from "./socket.js";
// Start the WebSocket server
socketConnection();

const app = express();

// CORS Middleware - CORS (Cross-Origin Resource Sharing)
app.use(
  cors({
    origin: [
      process.env.ADMIN_URL,
      process.env.MOBILE_URL,
      process.env.EDUCATOR_URL,
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Access-Control-Allow-Origin"],
    credentials: true,
  })
);

// Middleware of the file
app.use(express.json()); // Middleware for JSON parsing

// Ensure MONGODB_URI is set
const mongoURI = process.env.MONGODB_URI;
// console.log("Mongo URI:", mongoURI); // Log the MongoDB URI for debugging
if (!mongoURI) {
  console.error("Error: MONGODB_URI is not set in the environment variables.");
  process.exit(1); // Exit process if MongoDB URI is missing.
  // IF mongo DB is not Working.
}

// Connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// --ROUTES--
app.use("/activity", activityCollectionRoutes);
app.use("/session", sessionRoutes);
app.use("/doubt", doubtRoutes);
app.use("/viz", iVizRoutes);
app.use("/avatar", avatarRoutes);
app.use("/task", taskRoutes);
app.use("/sclass", sclassRoutes);
app.use("/chat", chatRoutes);
app.use("/setting", settingRoutes);
app.use("/kanban", kanbanRoutes);
app.use("/attention", attentionRoutes);
app.use("/deckQuiz", deckRoutes);
app.use("/quiz", quizRoutes);
app.use("/deckFLashCard", deckFCRoutes);
app.use("/flashCard", flashCard);
app.use("/prob", socratesProb);
app.use("/interestCollection", interestCollection);
app.use("/attentionAttempt", attentionAttemptRoutes);
app.use("/simulation", simulationRoutes);
app.use("/resource", resourceRoutes);
app.use("/nudge", nudgeRoutes);
app.use("/doubtcollection", doubtCollectionRoutes);
app.use("/leaderboard", leaderboardRoutes);
app.use("/engagement", engagementRoutes);
app.use("/badgeAward", badgeRoutes);
app.use("/audiobook", audiobookRoutes);
app.use("/video", videoRoutes);
app.use("/taskcomponent", taskComponentRoutes);
app.use("/tasksubmission", taskSubmissionRoutes);
app.use("/concept", conceptRoutes);
app.use("/concepthistory", conceptHistoryRoutes);
app.use("/revision", revisionRoutes);
app.use("/mission", missionRoutes);
app.use("/exam", examRoutes);
app.use("/result", resultRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Determine the correct server URL based on the environment
const URL =
  process.env.NODE_ENV === "production"
    ? process.env.SERVER_PRODUCTION_URL
    : process.env.SERVER_DEVELOPMENT_URL;

// Set PORT dynamically. (Mainly it will always be Active at port 3000).
const PORT = process.env.PORT || 3001;

// Start the server
app.listen(PORT, () => {
  // console.log(`CLIENT sending on ${process.env.CLIENT_URL}`);
  console.log(`SERVER listening on ${URL}:${PORT}`);
});

export default app; // Exporting the app for testing purposes
