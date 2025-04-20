import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import genAI from "../genAI.js"; // Importing the genAI module for API calls
import { app, httpServer, wss } from "../servermodule.js"; // Importing the server and WebSocket server
import activeAITest from "../data/initializers/activeAITest.js"; // Importing the activeAITest object

// Function to generate an AI test question
async function generateAITestQuestion(learnerId, learnerName, learnerWs) {
    try {
      const progress = activeAITest.learnerProgress.get(learnerId);
      if (!progress) return;
  
      const questionIndex = progress.currentQuestionIndex;
      const previousQuestionsAndAnswers = progress.questions.map((q, i) => {
        return {
          question: q,
          answer: progress.answers[i] || "No answer provided",
        };
      });
  
      // Construct the prompt based on test parameters
      let prompt = `You are an educational assessment system. Generate a question about ${activeAITest.subTopics.join(
        ", "
      )} with ${activeAITest.complexity} complexity.`;
  
      if (questionIndex > 0) {
        prompt += ` This is question #${
          questionIndex + 1
        } of 5. Based on the previous questions and answers:`;
  
        previousQuestionsAndAnswers.forEach((qa, i) => {
          prompt += `\nQuestion ${i + 1}: ${qa.question}\nStudent's answer: ${
            qa.answer
          }`;
        });
  
        prompt += `\nGenerate a question that builds on what you've learned about the student's understanding.`;
      } else {
        prompt += ` This is the first question to assess the student's understanding of these topics.`;
      }
  
      if (activeAITest.prompt) {
        prompt += ` Additional instructions: ${activeAITest.prompt}`;
      }
  
      prompt += ` Return ONLY the question text without any explanations or introductions. Keep the question concise and clear.`;
  
      // Call Gemini API
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const question = response.text().trim();
  
      // Store and send the question
      progress.questions.push(question);
  
      if (learnerWs && learnerWs.readyState === WebSocket.OPEN) {
        learnerWs.send(
          JSON.stringify({
            type: "ai_test_question",
            question: question,
            questionIndex: questionIndex,
            totalQuestions: 5,
            assistMode: activeAITest.testType === "assist",
          })
        );
      }
  
      // Update educator about the new question
      wss.clients.forEach(function each(client) {
        if (client.role === "educator" && client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              type: "ai_test_progress_update",
              learnerId: learnerId,
              learnerName: learnerName,
              currentQuestionIndex: questionIndex,
              question: question,
            })
          );
        }
      });
    } catch (error) {
      console.error("Error generating AI test question:", error);
  
      // Send error to learner
      if (learnerWs && learnerWs.readyState === WebSocket.OPEN) {
        learnerWs.send(
          JSON.stringify({
            type: "ai_test_error",
            error: "Failed to generate question. Please try again.",
          })
        );
      }
    }
  }

  export default generateAITestQuestion;