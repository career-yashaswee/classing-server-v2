import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import { GoogleGenerativeAI } from "@google/generative-ai";
import genAI from "../genAI.js"; // Importing the genAI module for API calls

// Function to generate flashcard content using Gemini API
async function generateFlashcard(title, subTopics, cardType, educatorWs) {
  let timeoutId = null;
  let isTimedOut = false;

  try {
    console.log(
      `Starting flashcard generation: "${title}" of type "${cardType}"`
    );

    // Validate inputs
    if (!title || !subTopics || subTopics.length === 0) {
      if (educatorWs.readyState === WebSocket.OPEN) {
        educatorWs.send(
          JSON.stringify({
            type: "flashcard_generation_error",
            error: "Invalid inputs: Title and subtopics are required",
          })
        );
      }
      return;
    }

    // Create a prompt for Gemini
    let prompt;

    if (cardType === "quiz") {
      prompt = `Create an educational flashcard about "${title}" that covers these sub-topics: ${subTopics.join(
        ", "
      )}.
        
        The flashcard should include:
        1. A concise summary explaining "${title}" and covering all the sub-topics listed in very short.
        2. A quiz question with multiple-choice options about this material.
        
        Format your response as JSON with this structure:
        {
          "content": "Summary text that explains the topic and all sub-topics concisely in very short...",
          "question": "Question text here?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": "Option that is correct"
        }`;
    } else if (cardType === "qa") {
      prompt = `Create an educational flashcard about "${title}" that covers these sub-topics: ${subTopics.join(
        ", "
      )}.
        
        The flashcard should include:
        1. A concise summary explaining "${title}" and covering all the sub-topics listed.
        2. An open-ended discussion question that prompts critical thinking about this material.
        3. A model answer to the question that demonstrates depth of understanding.
        
        Format your response as JSON with this structure:
        {
          "content": "Summary text that explains the topic and all sub-topics concisely in very short...",
          "question": "Open-ended question that prompts discussion and critical thinking?",
          "modelAnswer": "A comprehensive answer to the question that demonstrates understanding..."
        }`;
    } else {
      prompt = `Create an educational flashcard about "${title}" that covers these sub-topics: ${subTopics.join(
        ", "
      )}.
        
        The flashcard should include:
        1. A concise summary explaining "${title}" and covering all the sub-topics listed.
        2. An open-ended discussion question that prompts critical thinking about this material.
        
        Format your response as JSON with this structure:
        {
          "content": "Summary text that explains the topic and all sub-topics concisely...",
          "question": "Open-ended question that prompts discussion and critical thinking?"
        }`;
    }

    console.log(`Sending API request for flashcard: ${title}`);

    // Call Gemini API with timeout handling
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

    // For debugging, log a sample of the response (not the entire text which might be large)
    console.log("Response sample:", text.substring(0, 200) + "...");

    try {
      // Extract JSON from response text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : text;

      let content;
      try {
        content = JSON.parse(jsonString);
        console.log("Successfully parsed JSON response");
      } catch (jsonError) {
        console.error("Failed to parse JSON, attempting fallback parsing");

        // Fallback approach for malformed JSON
        const contentMatch = text.match(/"content"\s*:\s*"([^"]*)"/);
        const questionMatch = text.match(/"question"\s*:\s*"([^"]*)"/);

        if (contentMatch && questionMatch) {
          content = {
            content: contentMatch[1],
            question: questionMatch[1],
          };

          if (cardType === "quiz") {
            const optionsMatch = text.match(/"options"\s*:\s*\[(.*?)\]/s);
            const correctAnswerMatch = text.match(
              /"correctAnswer"\s*:\s*"([^"]*)"/
            );

            if (optionsMatch) {
              // Parse options array from string
              const optionsStr = optionsMatch[1];
              const options = optionsStr
                .split(",")
                .map((opt) => opt.trim().replace(/^"|"$/g, ""))
                .filter((opt) => opt.length > 0);

              content.options = options;
            } else {
              content.options = [
                "Option A",
                "Option B",
                "Option C",
                "Option D",
              ];
            }

            if (correctAnswerMatch) {
              content.correctAnswer = correctAnswerMatch[1];
            } else if (content.options && content.options.length > 0) {
              content.correctAnswer = content.options[0];
            }
          }
          console.log("Used fallback parsing successfully");
        } else {
          throw new Error("Could not extract required flashcard content");
        }
      }

      // Construct flashcard object based on type
      let flashcard = {
        cardType: cardType,
        type: cardType, // Include both for backward compatibility
        title: title,
        subTopics: subTopics,
        content: content.content,
        question: content.question || "What did you learn from this content?",
      };

      if (cardType === "quiz") {
        // Ensure we have options and a correct answer
        flashcard.options = content.options || [
          "Option A",
          "Option B",
          "Option C",
          "Option D",
        ];
        flashcard.correctAnswer = content.correctAnswer || flashcard.options[0];
      } else if (cardType === "qa") {
        flashcard.modelAnswer =
          content.modelAnswer ||
          "Reflect on the concepts presented in the content.";
      }

      // Check if websocket is still open
      if (!educatorWs || educatorWs.readyState !== WebSocket.OPEN) {
        console.error("WebSocket closed before sending response");
        return;
      }

      // Send flashcard content back to educator
      console.log("Sending generated flashcard to educator");
      educatorWs.send(
        JSON.stringify({
          type: "flashcard_generated",
          flashcard: flashcard,
        })
      );
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      // Send error to educator if connection is still open
      if (educatorWs && educatorWs.readyState === WebSocket.OPEN) {
        educatorWs.send(
          JSON.stringify({
            type: "flashcard_generation_error",
            error: "Failed to parse flashcard content: " + parseError.message,
          })
        );
      }
    }
  } catch (error) {
    console.error("Error generating flashcard:", error);

    // Clean up timeout if it exists
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    // Send error to educator if connection is still open
    if (educatorWs && educatorWs.readyState === WebSocket.OPEN) {
      educatorWs.send(
        JSON.stringify({
          type: "flashcard_generation_error",
          error: "Failed to generate flashcard: " + error.message,
        })
      );
    }
  }
}

export default generateFlashcard;
// This function generates flashcards using the Gemini API.