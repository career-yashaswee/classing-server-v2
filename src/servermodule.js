// src/server.js
// This file sets up an Express server and a WebSocket server.
import express from "express";
import { WebSocketServer, WebSocket } from "ws";

const app = express();
const httpServer = app.listen(8080);
const wss = new WebSocketServer({ server: httpServer });

export { app, httpServer, wss };
