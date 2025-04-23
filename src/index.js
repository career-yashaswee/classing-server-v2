import dotenv from "dotenv";
dotenv.config();
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

import LOG from "./log/LOG.js";
import socket from "./socket.js";

const app = express();

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

app.use(express.json());

// --ROUTES--
app.use("/attentionAttempt", attentionAttemptRoutes);
app.use("/interestCollection", interestCollection);
app.use("/doubtcollection", doubtCollectionRoutes);
app.use("/tasksubmission", taskSubmissionRoutes);
app.use("/concepthistory", conceptHistoryRoutes);
app.use("/activity", activityCollectionRoutes);
app.use("/taskcomponent", taskComponentRoutes);
app.use("/leaderboard", leaderboardRoutes);
app.use("/simulation", simulationRoutes);
app.use("/engagement", engagementRoutes);
app.use("/deckFLashCard", deckFCRoutes);
app.use("/attention", attentionRoutes);
app.use("/audiobook", audiobookRoutes);
app.use("/resource", resourceRoutes);
app.use("/revision", revisionRoutes);
app.use("/badgeAward", badgeRoutes);
app.use("/session", sessionRoutes);
app.use("/setting", settingRoutes);
app.use("/concept", conceptRoutes);
app.use("/mission", missionRoutes);
app.use("/avatar", avatarRoutes);
app.use("/sclass", sclassRoutes);
app.use("/kanban", kanbanRoutes);
app.use("/deckQuiz", deckRoutes);
app.use("/flashCard", flashCard);
app.use("/result", resultRoutes);
app.use("/doubt", doubtRoutes);
app.use("/prob", socratesProb);
app.use("/nudge", nudgeRoutes);
app.use("/video", videoRoutes);
app.use("/task", taskRoutes);
app.use("/chat", chatRoutes);
app.use("/quiz", quizRoutes);
app.use("/exam", examRoutes);
app.use("/viz", iVizRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Set PORT dynamically.
const PORT = process.env.DB_PORT || 3000;
const HOST = process.env.DB_HOSTNAME || "localhost";

app.listen(PORT, HOST, () => {
  console.log(`SERVER [${HOST}:${PORT}]`);
});

socket();

export default app;
