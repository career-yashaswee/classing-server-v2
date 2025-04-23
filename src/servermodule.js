import express from "express";
import { WebSocketServer, WebSocket } from "ws";

const app = express();
const httpServer = app.listen(8080);
const wss = new WebSocketServer({ server: httpServer });

export { app, httpServer, wss };
