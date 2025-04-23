import generateUniqueId from "./functions/utilities/generateUniqueId.js";
import { app, httpServer, wss } from "./servermodule.js";

import closeFunction from "./socket/closeFunction.js";
import wsConnections from "./socket/wsConnections.js";
import "./queue/message-worker.js";
import message from "./functions/message.js";

const socket = () => {
  console.log(
    `SOCKET [${process.env.SOCKET_HOSTNAME}:${process.env.SOCKET_PORT}]`
  );

  wss.on("connection", function connection(ws) {
    const clientId = generateUniqueId();
    ws.clientId = clientId;
    console.log(clientId);
    wsConnections.set(clientId, ws);
    ws.on("error", console.error);
    ws.on("message", message(ws));
    ws.on("close", () => {
      closeFunction(ws);
      wsConnections.delete(clientId);
    });
    ws.send(
      JSON.stringify({
        type: "WELCOME",
        message: "Connected to Classing Server!",
      })
    );
  });
};

export default socket;
