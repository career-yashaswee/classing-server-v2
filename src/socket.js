import { app, httpServer, wss } from "./servermodule.js";

import messageParameters from "./functions/message.js";
import closeFunction from "./functions/closeFunction.js";

const socketConnection = () => {
    console.log("SOCKET Listening on http://localhost:8080");

    wss.on("connection", function connection(ws) {
        ws.on("error", console.error);
        // Set the role of the client
        console.log("New client connected");
        ws.on("message", messageParameters(ws));
        // When a client disconnects
        ws.on("close", () => {
          closeFunction(ws);
        });
      
        // Send welcome message
        ws.send(
          JSON.stringify({ type: "welcome", message: "Connected to Classing!" })
        );
      });
};

// wss.on("connection", function connection(ws) {
//   ws.on("error", console.error);
//   // Set the role of the client
//   console.log("New client connected");
//   ws.on("message", messageParameters(ws));
//   // When a client disconnects
//   ws.on("close", () => {
//     closeFunction(ws);
//   });

//   // Send welcome message
//   ws.send(
//     JSON.stringify({ type: "welcome", message: "Connected to Classing!" })
//   );
// });

export default socketConnection;