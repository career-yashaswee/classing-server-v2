import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

import attentionAttemptRoutes from "../routes/attentionAttemptRoutes.js";
import interestCollection from "../routes/interestCollectionRoutes.js";
import doubtCollectionRoutes from "../routes/doubtCollectionRoutes.js";
import taskSubmissionRoutes from "../routes/taskSubmissionRoutes.js";
import conceptHistoryRoutes from "../routes/conceptHistoryRoutes.js";
import taskComponentRoutes from "../routes/taskComponentsRoutes.js";
import activityCollectionRoutes from "../routes/activityRoutes.js";
import leaderboardRoutes from "../routes/leaderboardRoutes.js";
import engagementRoutes from "../routes/engagementRoutes.js";
import attentionRoutes from "../routes/attentionRoutes.js";
import socratesProb from "../routes/socratesProbRoutes.js";
import audiobookRoutes from "../routes/audiobookRoutes.js";
import revisionRoutes from "../routes/revisionRoutes.js";
import badgeRoutes from "../routes/badgeAwardRoutes.js";
import sessionRoutes from "../routes/sessionRoutes.js";
import settingRoutes from "../routes/settingRoutes.js";
import simulationRoutes from "../routes/simulation.js";
import conceptRoutes from "../routes/conceptRoutes.js";
import missionRoutes from "../routes/missionRoutes.js";
import avatarRoutes from "../routes/avatarRoutes.js";
import sclassRoutes from "../routes/sclassRoutes.js";
import kanbanRoutes from "../routes/kanbanRoutes.js";
import deckFCRoutes from "../routes/deckFCRoutes.js";
import flashCard from "../routes/flashCardRoutes.js";
import resultRoutes from "../routes/resultRoutes.js";
import doubtRoutes from "../routes/doubtRoutes.js";
import resourceRoutes from "../routes/resource.js";
import nudgeRoutes from "../routes/nudgeRoutes.js";
import videoRoutes from "../routes/videoRoutes.js";
import iVizRoutes from "../routes/iVizRoutes.js";
import taskRoutes from "../routes/taskRoutes.js";
import chatRoutes from "../routes/chatRoutes.js";
import examRoutes from "../routes/examRoutes.js";
import deckRoutes from "../routes/deck.js";
import quizRoutes from "../routes/quiz.js";

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
app.use("/ping", (req, res) => {
  res.status(200).send("pong");
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = 3005;

app.listen(PORT, () => {
  console.log(`SERVER [http://localhost:${PORT}]`);
});

socket();

export default app;
