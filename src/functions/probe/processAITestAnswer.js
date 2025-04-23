import { WebSocketServer, WebSocket } from "ws";
import ai from "../../ai.js";
import { app, httpServer, wss } from "../../servermodule.js"; // Importing the server and WebSocket server
import activeAITest from "../../data/initializers/activeAITest.js";
import generateAITestQuestion from "./generateAITestQuestion.js "; // Importing the function to generate AI test questions
import generateAITestReport from "./generateAITestReport.js"; // Importing the function to generate AI test reports

async function processAITestAnswer(learnerId, learnerName, answer, learnerWs) {
  try {
    const progress = activeAITest.learnerProgress.get(learnerId);
    if (!progress) return;

    const currentQuestionIndex = progress.currentQuestionIndex;

    // Prepare feedback if in assist mode
    let feedback = null;
    if (activeAITest.testType === "assist") {
      let feedbackPrompt = `You are an educational assistant. The student was asked: "${progress.questions[currentQuestionIndex]}"
        
        The student answered: "${answer}"
        
        Provide a short, constructive feedback on their answer. Explain what they got right and where they might improve. 
        Keep your response brief (under 100 words) but educational.`;

      if (activeAITest.prompt) {
        feedbackPrompt += ` Additional context: ${activeAITest.prompt}`;
      }

      const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(feedbackPrompt);
      const response = await result.response;
      feedback = response.text().trim();
    }

    // Notify educator of the response
    wss.clients.forEach(function each(client) {
      if (client.role === "educator" && client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: "ai_test_answer_received",
            learnerId: learnerId,
            learnerName: learnerName,
            questionIndex: currentQuestionIndex,
            answer: answer,
            feedback: feedback,
          })
        );
      }
    });

    // Send feedback to learner if in assist mode
    if (
      activeAITest.testType === "assist" &&
      feedback &&
      learnerWs.readyState === WebSocket.OPEN
    ) {
      learnerWs.send(
        JSON.stringify({
          type: "ai_test_feedback",
          feedback: feedback,
          questionIndex: currentQuestionIndex,
        })
      );
    }

    // Move to next question or finish the test
    progress.currentQuestionIndex++;

    if (progress.currentQuestionIndex < 5) {
      // Generate next question
      generateAITestQuestion(learnerId, learnerName, learnerWs);
    } else {
      // Generate final report
      generateAITestReport(learnerId, learnerName, learnerWs);
    }
  } catch (error) {
    console.error("Error processing AI test answer:", error);

    // Notify learner of error
    if (learnerWs && learnerWs.readyState === WebSocket.OPEN) {
      learnerWs.send(
        JSON.stringify({
          type: "ai_test_error",
          error:
            "Failed to process your answer. Please continue to the next question.",
        })
      );

      // Try to continue anyway if not at the end
      const progress = activeAITest.learnerProgress.get(learnerId);
      if (progress && progress.currentQuestionIndex < 4) {
        progress.currentQuestionIndex++;
        generateAITestQuestion(learnerId, learnerName, learnerWs);
      }
    }
  }
}

export default processAITestAnswer;
