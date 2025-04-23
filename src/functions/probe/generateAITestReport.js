import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ai from "../../ai.js";
import { app, httpServer, wss } from "../../servermodule.js";

// Import initilizers
import activeAITest from "../../data/initializers/activeAITest.js";

// Function to generate a final report for an AI test
async function generateAITestReport(learnerId, learnerName, learnerWs) {
  try {
    const progress = activeAITest.learnerProgress.get(learnerId);
    if (!progress) return;

    // Construct prompt for report generation
    let reportPrompt = `You are an educational assessment system. Review a student's answers to 5 questions about ${activeAITest.subTopics.join(
      ", "
    )} at ${activeAITest.complexity} complexity level.
      
      Here are the questions and the student's answers:`;

    for (let i = 0; i < progress.questions.length; i++) {
      reportPrompt += `\n\nQuestion ${i + 1}: ${
        progress.questions[i]
      }\nStudent's answer: ${progress.answers[i] || "No answer provided"}`;
    }

    reportPrompt += `\n\nProvide a concise assessment (maximum 150 words) of the student's understanding of the topic. 
      Highlight strengths and areas for improvement. Start with a clear statement of whether the student has a strong, 
      adequate, or limited understanding of the topic.`;

    if (activeAITest.prompt) {
      reportPrompt += ` Additional context: ${activeAITest.prompt}`;
    }

    // Call Gemini API
    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(reportPrompt);
    const response = await result.response;
    const report = response.text().trim();

    // Store the report
    progress.report = report;
    activeAITest.completedLearners.add(learnerId);

    // Send report to educator
    wss.clients.forEach(function each(client) {
      if (client.role === "educator" && client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: "ai_test_report",
            learnerId: learnerId,
            learnerName: learnerName,
            report: report,
            questions: progress.questions,
            answers: progress.answers,
          })
        );
      }
    });

    // Send completion message to learner
    if (learnerWs && learnerWs.readyState === WebSocket.OPEN) {
      learnerWs.send(
        JSON.stringify({
          type: "ai_test_completed",
          message:
            "You have completed all questions. Your teacher will receive a report on your understanding.",
        })
      );
    }
  } catch (error) {
    console.error("Error generating AI test report:", error);

    // Send error to educator
    wss.clients.forEach(function each(client) {
      if (client.role === "educator" && client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: "ai_test_error",
            learnerId: learnerId,
            learnerName: learnerName,
            error: "Failed to generate final report for this student.",
          })
        );
      }
    });

    // Send completion message to learner anyway
    if (learnerWs && learnerWs.readyState === WebSocket.OPEN) {
      learnerWs.send(
        JSON.stringify({
          type: "ai_test_completed",
          message:
            "You have completed all questions. Thank you for participating.",
        })
      );
    }
  }
}

export default generateAITestReport;