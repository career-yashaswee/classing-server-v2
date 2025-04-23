import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import ai from "../../ai.js";

// Function to generate quiz questions using Gemini API
async function generateQuiz(keywords, educatorWs) {
  try {
    // Create a prompt for Gemini
    const prompt = `Generate 5 multiple-choice quiz questions about the following topic or keywords: ${keywords.join(
      ", "
    )}. 
    First, analyze these keywords to determine the most likely subject with topic being taught.
    Then create 5 appropriate quiz questions, each with 4 possible answers (where only one is correct).
    Format your response as a JSON array with this structure:
    [
      {
        "question": "Question text here?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "Option that is correct"
      },
      ...more questions...
    ]`;

    // Call Gemini API
    var text = "";
    const vendor = process.env.AI_VENDOR;
    if (vendor == "ollama") {
      const response = await axios.post("http://localhost:11434/api/generate", {
        model: "llama3.2",
        prompt,
      });
      text = response.data;
      console.log(text);
    } else {
      const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      text = response.text();
    }

    try {
      // Extract JSON from response text
      const jsonMatch = text.match(/\[\s*\{.*\}\s*\]/s);
      const jsonString = jsonMatch ? jsonMatch[0] : text;
      const questions = JSON.parse(jsonString);

      // Send questions back to educator
      if (educatorWs.readyState === WebSocket.OPEN) {
        educatorWs.send(
          JSON.stringify({
            type: "quiz_generated",
            questions: questions,
          })
        );
      }
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      // Send error to educator
      if (educatorWs.readyState === WebSocket.OPEN) {
        educatorWs.send(
          JSON.stringify({
            type: "quiz_generation_error",
            error: "Failed to parse quiz questions from AI response",
          })
        );
      }
    }
  } catch (error) {
    console.error("Error generating quiz:", error);
    // Send error to educator
    if (educatorWs.readyState === WebSocket.OPEN) {
      educatorWs.send(
        JSON.stringify({
          type: "quiz_generation_error",
          error: "Failed to generate quiz questions",
        })
      );
    }
  }
}

export default generateQuiz;
