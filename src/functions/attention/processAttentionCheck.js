import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import attentionCheck from "../../data/initializers/attentionCheck.js";

function processAttentionCheck(educatorWs) {
  attentionCheck.active = false;

  // Calculate results
  const results = attentionCheck.options.map((option) => ({
    option: option,
    count: 0,
    percentage: 0,
  }));

  const totalResponses = Object.keys(attentionCheck.responses).length;

  if (totalResponses > 0) {
    // Count responses for each option
    Object.values(attentionCheck.responses).forEach((answer) => {
      const index = attentionCheck.options.indexOf(answer);
      if (index !== -1) {
        results[index].count++;
      }
    });
    // Calculate percentages
    results.forEach((result) => {
      result.percentage = Math.round((result.count / totalResponses) * 100);
    });
  }

  // Send results to educator
  if (educatorWs.readyState === WebSocket.OPEN) {
    educatorWs.send(
      JSON.stringify({
        type: "attention_results",
        results: results,
        totalResponses: totalResponses,
      })
    );
  }
}

export default processAttentionCheck;
