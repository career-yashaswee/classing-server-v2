import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import { app, httpServer, wss } from "../servermodule.js";

function broadcastToLearners(message) {
  const messageStr = JSON.stringify(message);
  // 'Each' is a method of the WebSocketServer class that iterates over all connected clients
  // and executes the provided function for each client.
  // In this case, it checks if the client is ready and has the role of "learner"
  // before sending the message.
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN && client.role === "learner") {
      client.send(messageStr);
    }
  });
}

export default broadcastToLearners;