import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import genAI from "../genAI.js";

// Import initilizers
import doubtSession from "../data/initializers/doubtSession.js";

// Process doubts using Gemini API
async function processDoubts(educatorWs) {
  doubtSession.active = false;

  if (doubtSession.doubts.length === 0) {
    if (educatorWs.readyState === WebSocket.OPEN) {
      educatorWs.send(
        JSON.stringify({
          type: "doubt_summary",
          summary: "No doubts were submitted during this session.",
        })
      );
    }

    return;
  }

  try {
    // In a real application, you would call the Gemini API here

    // For now, we'll simulate it with a delay and formatted response
    let timeoutId = null;
    let isTimedOut = false;
    const allDoubts = doubtSession.doubts.join("\n- ");
    console.log(allDoubts);
    const prompt = `Segregate the list of doubts into Conceptual and Theoretical Doubts, then, tag and summarise them.
      The List :-
      ${allDoubts}`;
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Create a promise that will reject after a timeout
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        isTimedOut = true;
        reject(new Error("API request timed out"));
      }, 15000); // Match timeout with frontend (15 seconds)
    });

    // Race between the API call and the timeout
    const result = await Promise.race([
      model.generateContent(prompt),
      timeoutPromise,
    ]);

    // Clear timeout if we got a response
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    if (isTimedOut) {
      throw new Error("API request timed out");
    }

    const response = await result.response;
    const text = response.text();
    console.log("Received response from Gemini API");

    if (educatorWs.readyState === WebSocket.OPEN) {
      educatorWs.send(
        JSON.stringify({
          type: "doubt_summary",
          summary: text,
          rawDoubts: doubtSession.doubts,
        })
      );
    }
  } catch (error) {
    console.error("Error processing doubts:", error);

    if (educatorWs.readyState === WebSocket.OPEN) {
      educatorWs.send(
        JSON.stringify({
          type: "doubt_summary",

          error: "Failed to process doubts",
        })
      );
    }
  }
}
export default processDoubts;