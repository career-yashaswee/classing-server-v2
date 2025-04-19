import { app, httpServer, wss } from "./server.js";

import message from "./functions/message.js";
import closeFunction from "./functions/closeFunction.js";

console.log("Server is running on http://localhost:8080");

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);
  // Set the role of the client
  ws.on("message", message(data, isBinary));
  // When a client disconnects
  ws.on("close", closeFunction);
  // Send welcome message
  ws.send(
    JSON.stringify({ type: "welcome", message: "Connected to Classing!" })
  );
});
