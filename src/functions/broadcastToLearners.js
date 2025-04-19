import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import { app, httpServer, wss } from "../server.js";

function broadcastToLearners(message) {
  const messageStr = JSON.stringify(message);
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN && client.role === "learner") {
      client.send(messageStr);
    }
  });
}

export default broadcastToLearners;