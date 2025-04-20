import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import { app, httpServer, wss } from "../servermodule.js";

// Import initilizers
import activeQuiz from "../data/initializers/activeQuiz.js";
import attentionCheck from "../data/initializers/attentionCheck.js";
import doubtSession from "../data/initializers/doubtSession.js";
import activeFlashcard from "../data/initializers/activeFlashcard.js";
import activeAITest from "../data/initializers/activeAITest.js";

// Import utility functions
import broadcastToLearners from "../functions/broadcastToLearners.js";
import generateUniqueId from "../functions/generateUniqueId.js";
import generateFlashcard from "../functions/generateFlashcard.js";
import generateQuiz from "../functions/generateQuiz.js";
import generateAITestQuestion from "../functions/generateAITestQuestion.js";
import processAITestAnswer from "../functions/processAITestAnswer.js";
import generateAITestReport from "../functions/generateAITestReport.js";
import processAttentionCheck from "../functions/processAttentionCheck.js";
import processDoubts from "../functions/processDoubts.js";

// Track state
let educatorOnline = false;
let currentTopic = null;

function message(ws, data, isBinary) {
  try {
    const message = JSON.parse(data.toString());

    if (message.type === "register") {
      ws.role = message.role; // 'educator' or 'learner'

      if (ws.role === "educator") {
        educatorOnline = true;
        // Notify all learners that educator is online
        broadcastToLearners({ type: "educator_status", online: true });

        // If there's already an active quiz, send the current state to the educator
        if (activeQuiz.active) {
          ws.send(
            JSON.stringify({
              type: "quiz_started",
              totalQuestions: activeQuiz.questions.length,
              questions: activeQuiz.questions,
            })
          );

          // Send all existing responses
          for (
            let questionIndex = 0;
            questionIndex < activeQuiz.questions.length;
            questionIndex++
          ) {
            if (
              activeQuiz.responses[questionIndex] &&
              activeQuiz.responses[questionIndex].length > 0
            ) {
              ws.send(
                JSON.stringify({
                  type: "quiz_results_update",
                  questionIndex: questionIndex,
                  responses: activeQuiz.responses[questionIndex],
                  questionData: activeQuiz.questions[questionIndex],
                })
              );
            }
          }
        }

        // If there's an active flashcard, send it to the educator
        if (activeFlashcard.active) {
          ws.send(
            JSON.stringify({
              type: "flashcard_active",
              flashcard: activeFlashcard,
              responses: activeFlashcard.responses,
              skippedCount: activeFlashcard.skippedLearners.size,
            })
          );
        }

        if (attentionCheck.active) {
          const timeRemaining = Math.max(
            0,
            60 - (Date.now() - attentionCheck.startTime) / 1000
          );
          ws.send(
            JSON.stringify({
              type: "attention_check",
              question: attentionCheck.question,
              options: attentionCheck.options,
              timeRemaining: Math.round(timeRemaining),
            })
          );
        }

        // If there's an active doubt session, send it to the new learner
        if (doubtSession.active) {
          const timeRemaining = Math.max(
            0,
            90 - (Date.now() - doubtSession.startTime) / 1000
          );
          ws.send(
            JSON.stringify({
              type: "doubt_session",
              timeRemaining: Math.round(timeRemaining),
            })
          );
        }

        // If there's an active AI test, send it to the educator
        if (activeAITest.active) {
          ws.send(
            JSON.stringify({
              type: "ai_test_active",
              aiTest: {
                testType: activeAITest.testType,
                complexity: activeAITest.complexity,
                subTopics: activeAITest.subTopics,
                prompt: activeAITest.prompt,
              },
              learnerProgress: Array.from(activeAITest.learnerProgress).map(
                ([learnerId, progress]) => ({
                  learnerId,
                  learnerName: progress.learnerName,
                  currentQuestionIndex: progress.currentQuestionIndex,
                  report: progress.report,
                })
              ),
            })
          );
        }
      } else if (ws.role === "learner") {
        // Generate a unique ID for the learner
        ws.learnerId = generateUniqueId();
        ws.learnerName = message.name || "Anonymous";

        // Add learner to active learners set
        activeQuiz.activeLearners.add(ws.learnerId);

        // Initialize learner at question 0 if quiz is active
        if (activeQuiz.active) {
          activeQuiz.learnerQuestions.set(ws.learnerId, 0);
        }

        console.log(`Learner connected: ${ws.learnerId} (${ws.learnerName})`);
        console.log(
          `Active learners: ${Array.from(activeQuiz.activeLearners).join(", ")}`
        );

        // Send current status to new learner
        ws.send(
          JSON.stringify({
            type: "educator_status",
            online: educatorOnline,
            currentTopic: currentTopic,
          })
        );

        // If there's an active quiz, send the first question to the new learner
        if (activeQuiz.active && activeQuiz.questions.length > 0) {
          const firstQuestion = activeQuiz.questions[0];
          ws.send(
            JSON.stringify({
              type: "quiz_question",
              question: firstQuestion.question,
              options: firstQuestion.options,
              questionIndex: 0,
              totalQuestions: activeQuiz.questions.length,
              timeLimit: 30,
            })
          );
        }

        // If there's an active flashcard, send it to the new learner
        if (activeFlashcard.active) {
          ws.send(
            JSON.stringify({
              type: "flashcard_display",
              flashcard: {
                type: activeFlashcard.type,
                title: activeFlashcard.title,
                content: activeFlashcard.content,
                question: activeFlashcard.question,
                options: activeFlashcard.options,
              },
            })
          );
        }

        // If there's an active AI test, and this learner hasn't completed it yet
        if (
          activeAITest.active &&
          !activeAITest.completedLearners.has(ws.learnerId)
        ) {
          // Initialize learner in the AI test if not already
          if (!activeAITest.learnerProgress.has(ws.learnerId)) {
            activeAITest.learnerProgress.set(ws.learnerId, {
              learnerName: ws.learnerName,
              questions: [],
              answers: [],
              currentQuestionIndex: 0,
              report: null,
            });

            // Generate first question for this learner
            generateAITestQuestion(ws.learnerId, ws.learnerName, ws);
          } else {
            // Learner was already in progress, send the current question
            const progress = activeAITest.learnerProgress.get(ws.learnerId);
            if (progress.currentQuestionIndex < 5) {
              ws.send(
                JSON.stringify({
                  type: "ai_test_question",
                  question: progress.questions[progress.currentQuestionIndex],
                  questionIndex: progress.currentQuestionIndex,
                  totalQuestions: 5,
                  assistMode: activeAITest.testType === "assist",
                })
              );
            }
          }
        }
      }
    } else if (message.type === "select_topic") {
      if (ws.role === "educator") {
        currentTopic = message.topic;
        // Broadcast selected topic to all learners
        broadcastToLearners({ type: "topic_selected", topic: currentTopic });
      }
    } else if (message.type === "chat") {
      // Regular chat message
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message));
        }
      });
    } else if (message.type === "generate_quiz") {
      if (ws.role === "educator") {
        // Generate quiz based on keywords
        generateQuiz(message.keywords, ws);
      }
    } else if (message.type === "generate_flashcard") {
      if (ws.role === "educator") {
        // Generate flashcard content based on topics and type
        generateFlashcard(
          message.title,
          message.subTopics,
          message.cardType,
          ws
        );
      }
    } else if (message.type === "start_flashcard") {
      if (ws.role === "educator") {
        // Reset flashcard state
        activeFlashcard = {
          active: true,
          type: message.flashcard.type,
          title: message.flashcard.title,
          content: message.flashcard.content,
          subTopics: message.flashcard.subTopics,
          question: message.flashcard.question || null,
          options: message.flashcard.options || [],
          correctAnswer: message.flashcard.correctAnswer || "",
          modelAnswer: message.flashcard.modelAnswer || "",
          responses: [],
          respondedLearners: new Set(),
          skippedLearners: new Set(), // Initialize empty set for skipped learners
        };

        // Send flashcard to all learners
        broadcastToLearners({
          type: "flashcard_display",
          flashcard: {
            type: activeFlashcard.type,
            title: activeFlashcard.title,
            content: activeFlashcard.content,
            question: activeFlashcard.question,
            options: activeFlashcard.options,
          },
        });

        // Send confirmation to educator
        ws.send(
          JSON.stringify({
            type: "flashcard_started",
            flashcard: activeFlashcard,
          })
        );
      }
    } else if (message.type === "end_flashcard") {
      if (ws.role === "educator") {
        // End active flashcard
        activeFlashcard.active = false;

        // Notify all learners
        broadcastToLearners({
          type: "flashcard_ended",
        });

        // Send final results to educator
        ws.send(
          JSON.stringify({
            type: "flashcard_ended",
            responses: activeFlashcard.responses,
            skippedCount: activeFlashcard.skippedLearners.size,
          })
        );
      }
    } else if (message.type === "submit_flashcard_answer") {
      if (ws.role === "learner" && activeFlashcard.active) {
        // Store response
        const responseObj = {
          learnerId: ws.learnerId,
          learnerName: ws.learnerName,
          answer: message.answer,
          timestamp: new Date().toISOString(),
        };

        activeFlashcard.responses.push(responseObj);
        activeFlashcard.respondedLearners.add(ws.learnerId);

        // Send acknowledgment to learner with thank you message
        ws.send(
          JSON.stringify({
            type: "flashcard_answer_received",
            message:
              "Thank you for your submission! Your response has been recorded.",
          })
        );

        // Send updated results to educator
        wss.clients.forEach(function each(client) {
          if (
            client.role === "educator" &&
            client.readyState === WebSocket.OPEN
          ) {
            client.send(
              JSON.stringify({
                type: "flashcard_response_update",
                response: responseObj,
                responses: activeFlashcard.responses,
                skippedCount: activeFlashcard.skippedLearners.size,
              })
            );
          }
        });
      }
    } else if (message.type === "skip_flashcard") {
      if (ws.role === "learner" && activeFlashcard.active) {
        // Mark as skipped
        activeFlashcard.skippedLearners.add(ws.learnerId);

        // Send acknowledgment to learner
        ws.send(
          JSON.stringify({
            type: "flashcard_skipped",
            message: "You've skipped this flashcard.",
          })
        );

        // Notify educator about the skip
        wss.clients.forEach(function each(client) {
          if (
            client.role === "educator" &&
            client.readyState === WebSocket.OPEN
          ) {
            client.send(
              JSON.stringify({
                type: "flashcard_skip_update",
                learnerId: ws.learnerId,
                learnerName: ws.learnerName,
                skippedCount: activeFlashcard.skippedLearners.size,
                timestamp: new Date().toISOString(),
              })
            );
          }
        });
      }
    } else if (message.type === "start_quiz") {
      if (ws.role === "educator") {
        // Preserve active learners when starting a new quiz
        const activeLearners = activeQuiz.activeLearners;

        // Start the quiz with custom or generated questions
        activeQuiz = {
          active: true,
          questions: message.questions,
          currentQuestionIndex: 0,
          responses: {},
          activeLearners: activeLearners, // Preserve active learners
          respondedLearners: new Set(), // Reset responded learners
          learnerQuestions: new Map(), // Reset learner questions
          learnerResponses: new Map(), // Reset learner responses
        };

        // Initialize all active learners at question 0
        activeLearners.forEach((learnerId) => {
          activeQuiz.learnerQuestions.set(learnerId, 0);
          activeQuiz.learnerResponses.set(learnerId, []);
        });

        console.log(
          `Starting quiz with active learners: ${Array.from(
            activeQuiz.activeLearners
          ).join(", ")}`
        );

        // Initialize response tracking for each question
        activeQuiz.questions.forEach((_, index) => {
          activeQuiz.responses[index] = [];
        });

        // Send first question to all learners
        const firstQuestion = activeQuiz.questions[0];
        broadcastToLearners({
          type: "quiz_question",
          question: firstQuestion.question,
          options: firstQuestion.options,
          questionIndex: 0,
          totalQuestions: activeQuiz.questions.length,
          timeLimit: 30,
        });

        // Send confirmation to educatorq
        ws.send(
          JSON.stringify({
            type: "quiz_started",
            totalQuestions: activeQuiz.questions.length,
            questions: activeQuiz.questions,
          })
        );
      }
    } else if (message.type === "end_quiz") {
      if (ws.role === "educator" && activeQuiz.active) {
        // End quiz immediately
        activeQuiz.active = false;

        // Notify all learners
        broadcastToLearners({
          type: "quiz_ended",
          message: "The teacher has ended the quiz.",
        });

        // Send final results to educator
        ws.send(
          JSON.stringify({
            type: "quiz_ended",
            finalResults: activeQuiz.responses,
            questions: activeQuiz.questions,
          })
        );
      }
    } else if (message.type === "next_question") {
      if (ws.role === "educator" && activeQuiz.active) {
        // This is only used when the educator manually advances all learners
        const nextIndex = activeQuiz.currentQuestionIndex + 1;

        if (nextIndex < activeQuiz.questions.length) {
          activeQuiz.currentQuestionIndex = nextIndex;

          // Reset responded learners for new question
          activeQuiz.respondedLearners.clear();

          const nextQuestion = activeQuiz.questions[nextIndex];

          // Move all learners to the next question
          activeQuiz.activeLearners.forEach((learnerId) => {
            activeQuiz.learnerQuestions.set(learnerId, nextIndex);
          });

          // Send next question to all learners
          broadcastToLearners({
            type: "quiz_question",
            question: nextQuestion.question,
            options: nextQuestion.options,
            questionIndex: nextIndex,
            totalQuestions: activeQuiz.questions.length,
            timeLimit: 30,
          });

          // Send confirmation to educator
          ws.send(
            JSON.stringify({
              type: "question_changed",
              currentIndex: nextIndex,
            })
          );
        } else {
          // End of quiz
          activeQuiz.active = false;

          // Notify all learners
          broadcastToLearners({
            type: "quiz_ended",
            message: "The quiz has ended.",
          });

          // Send final results to educator
          ws.send(
            JSON.stringify({
              type: "quiz_ended",
              finalResults: activeQuiz.responses,
              questions: activeQuiz.questions,
            })
          );
        }
      }
    } else if (message.type === "submit_answer") {
      if (ws.role === "learner" && activeQuiz.active) {
        const { questionIndex, answer, isTimeout, isSkipped } = message;

        console.log("Received answer:", {
          learnerId: ws.learnerId,
          questionIndex,
          answer,
          isTimeout,
          isSkipped,
        });

        // Make sure responses array exists for this question
        if (!activeQuiz.responses[questionIndex]) {
          activeQuiz.responses[questionIndex] = [];
        }

        // Store response
        const responseObj = {
          learnerId: ws.learnerId,
          learnerName: ws.learnerName,
          answer: answer || "No Answer", // Ensure there's always a value
          timestamp: new Date().toISOString(),
        };

        activeQuiz.responses[questionIndex].push(responseObj);

        // Store in learner's individual response array
        const learnerResponses =
          activeQuiz.learnerResponses.get(ws.learnerId) || [];
        learnerResponses[questionIndex] = responseObj;
        activeQuiz.learnerResponses.set(ws.learnerId, learnerResponses);

        // Add learner to responded set
        activeQuiz.respondedLearners.add(ws.learnerId);

        // Send acknowledgment to the learner
        ws.send(
          JSON.stringify({
            type: "answer_received",
            questionIndex: questionIndex,
            message:
              "Thank you for your answer. Your response has been recorded.",
          })
        );

        // Send updated results to educator
        wss.clients.forEach(function each(client) {
          if (
            client.role === "educator" &&
            client.readyState === WebSocket.OPEN
          ) {
            client.send(
              JSON.stringify({
                type: "quiz_results_update",
                questionIndex: questionIndex,
                responses: activeQuiz.responses[questionIndex],
                questionData: activeQuiz.questions[questionIndex],
              })
            );
          }
        });

        // Check if this learner should move to next question
        // const currentLearnerQuestion =
        //   activeQuiz.learnerQuestions.get(ws.learnerId) || 0;
        // const nextQuestionIndex = currentLearnerQuestion + 1;

        // If there's a next question, send it to this learner
        // if (nextQuestionIndex < activeQuiz.questions.length) {
        // Update the learner's current question
        // activeQuiz.learnerQuestions.set(ws.learnerId, nextQuestionIndex);

        // const nextQuestion = activeQuiz.questions[nextQuestionIndex];

        // console.log(
        //   `Moving learner ${ws.learnerId} to question ${nextQuestionIndex}`
        // );

        // Send next question to this specific learner
        // ws.send(
        //   JSON.stringify({
        //     type: "quiz_question",
        //     question: nextQuestion.question,
        //     options: nextQuestion.options,
        //     questionIndex: nextQuestionIndex,
        //     totalQuestions: activeQuiz.questions.length,
        //     timeLimit: 30,
        //   })
        // );
      } else if (ws.role === "learner" && attentionCheck.active) {
        attentionCheck.responses[ws.learnerId] = message.answer;
      } else {
        // This learner has completed all questions
        console.log(`Learner ${ws.learnerId} has completed all questions`);

        // Tell this learner they've completed the quiz
        ws.send(
          JSON.stringify({
            type: "quiz_completed",
            message:
              "You have completed all questions. Thank you for participating!",
          })
        );

        // Check if all learners have completed all questions
        let allCompleted = true;
        for (const [
          learnerId,
          questionIndex,
        ] of activeQuiz.learnerQuestions.entries()) {
          if (questionIndex < activeQuiz.questions.length - 1) {
            allCompleted = false;
            break;
          }
        }

        // If all learners have completed all questions, end the quiz
        if (allCompleted && activeQuiz.activeLearners.size > 0) {
          activeQuiz.active = false;

          // Notify all learners
          broadcastToLearners({
            type: "quiz_ended",
            message: "The quiz has ended. Thank you for participating!",
          });

          // Send final results to educator
          wss.clients.forEach(function each(client) {
            if (
              client.role === "educator" &&
              client.readyState === WebSocket.OPEN
            ) {
              client.send(
                JSON.stringify({
                  type: "quiz_ended",
                  finalResults: activeQuiz.responses,
                  questions: activeQuiz.questions,
                })
              );
            }
          });
        }
      }
    } else if (message.type === "clear_quiz_responses") {
      if (ws.role === "educator") {
        // Clear responses for a specific question or all questions
        if (message.questionIndex !== undefined) {
          // Clear responses for a specific question
          activeQuiz.responses[message.questionIndex] = [];

          // Notify educator
          ws.send(
            JSON.stringify({
              type: "quiz_results_update",
              questionIndex: message.questionIndex,
              responses: [],
              questionData: activeQuiz.questions[message.questionIndex],
            })
          );
        } else {
          // Clear all responses
          activeQuiz.questions.forEach((_, index) => {
            activeQuiz.responses[index] = [];
          });

          // Notify educator of all cleared responses
          activeQuiz.questions.forEach((question, index) => {
            ws.send(
              JSON.stringify({
                type: "quiz_results_update",
                questionIndex: index,
                responses: [],
                questionData: question,
              })
            );
          });
        }
      }
    } else if (message.type === "cancel_flashcard_generation") {
      if (ws.role === "educator") {
        console.log("Received flashcard generation cancellation request");
        // This is just to acknowledge the cancellation, the actual cancellation
        // is handled client-side by cleaning up the UI state
      }
    } else if (message.type === "generate_ai_test") {
      if (ws.role === "educator") {
        // Reset AI test state
        activeAITest = {
          active: true,
          testType: message.testType,
          complexity: message.complexity,
          subTopics: message.subTopics,
          prompt: message.prompt || "",
          currentQuestion: null,
          currentLearner: null,
          learnerProgress: new Map(),
          completedLearners: new Set(),
        };

        // Notify educator
        ws.send(
          JSON.stringify({
            type: "ai_test_generated",
            aiTest: {
              testType: activeAITest.testType,
              complexity: activeAITest.complexity,
              subTopics: activeAITest.subTopics,
              prompt: activeAITest.prompt,
            },
          })
        );

        // Notify all learners
        broadcastToLearners({
          type: "ai_test_started",
          testType: activeAITest.testType,
          message:
            activeAITest.testType === "normal"
              ? "Your teacher has started an AI assessment. Be ready to answer some questions!"
              : "Your teacher has started an AI-assisted learning session. You'll be asked questions and receive feedback.",
        });
      }
    } else if (message.type === "end_ai_test") {
      if (ws.role === "educator" && activeAITest.active) {
        // End AI test
        activeAITest.active = false;

        // Create a summary of results to return to educator
        const results = Array.from(activeAITest.learnerProgress.entries()).map(
          ([learnerId, progress]) => ({
            learnerId,
            learnerName: progress.learnerName,
            questionsAnswered: progress.currentQuestionIndex,
            report: progress.report,
            questions: progress.questions,
            answers: progress.answers,
          })
        );

        // Notify all learners
        broadcastToLearners({
          type: "ai_test_ended",
          message: "The AI test session has ended.",
        });

        // Send results to educator
        ws.send(
          JSON.stringify({
            type: "ai_test_ended",
            results: results,
          })
        );
      }
    } else if (message.type === "submit_ai_test_answer") {
      if (ws.role === "learner" && activeAITest.active) {
        // Store the learner's answer
        const progress = activeAITest.learnerProgress.get(ws.learnerId);

        if (progress) {
          progress.answers.push(message.answer);

          // Process the answer and determine the next question or generate a report
          processAITestAnswer(ws.learnerId, ws.learnerName, message.answer, ws);
        }
      }
    } else if (message.type === "launch_interest_investigation") {
      if (ws.role === "educator") {
        broadcastToLearners({
          type: "interest_display",
          question: message.question,
          investigation_type: message.investigation_type,
        });
        ws.send(
          JSON.stringify({
            type: "interest_investigation_started",
          })
        );
      }
    } else if (message.type === "submit_interest_answer") {
      if (ws.role === "learner") {
        console.log("Received interest answer:", message.answer);

        wss.clients.forEach(function each(client) {
          if (
            client.role === "educator" &&
            client.readyState === WebSocket.OPEN
          ) {
            client.send(
              JSON.stringify({
                type: "interest_answer_received",
                response: message.answer,
                learnerName: message.learnerName,
                id: ws.learnerId,
              })
            );
          }
        });
      }
    } else if (message.type === "launch_doubt_session") {
      if (ws.role === "educator") {
        // Start a new doubt session
        doubtSession = {
          active: true,
          startTime: Date.now(),
          doubts: [],
          timeoutId: setTimeout(() => processDoubts(ws), 45000), // 90 seconds
        };

        // Notify all learners
        broadcastToLearners({
          type: "doubt_session",
          timeRemaining: 90,
        });
      }
    } else if (message.type === "submit_doubt") {
      if (ws.role === "learner" && doubtSession.active) {
        doubtSession.doubts.push(message.doubt);
      }
    } else if (message.type === "launch_attention_check") {
      if (ws.role === "educator") {
        attentionCheck = {
          active: true,
          question: message.question,
          options: message.options,
          startTime: Date.now(),
          responses: {},
          timeoutId: setTimeout(() => processAttentionCheck(ws), 60000), // 60 seconds
        };
        // Notify all learners
        broadcastToLearners({
          type: "attention_check",
          question: message.question,
          options: message.options,
          timeRemaining: 60,
        });
      }
    }
  } catch (error) {
    console.error("Error processing message:", error);
  }
}

const messageParameters = (ws) => {
  console.log("Message parameters initialized");
  return (data, isBinary) => {
    message(ws, data, isBinary);
  };
};
// function message(data, isBinary) {
//   try {
//     const message = JSON.parse(data.toString());

//     if (message.type === "register") {
//       ws.role = message.role; // 'educator' or 'learner'

//       if (ws.role === "educator") {
//         educatorOnline = true;
//         // Notify all learners that educator is online
//         broadcastToLearners({ type: "educator_status", online: true });

//         // If there's already an active quiz, send the current state to the educator
//         if (activeQuiz.active) {
//           ws.send(
//             JSON.stringify({
//               type: "quiz_started",
//               totalQuestions: activeQuiz.questions.length,
//               questions: activeQuiz.questions,
//             })
//           );

//           // Send all existing responses
//           for (
//             let questionIndex = 0;
//             questionIndex < activeQuiz.questions.length;
//             questionIndex++
//           ) {
//             if (
//               activeQuiz.responses[questionIndex] &&
//               activeQuiz.responses[questionIndex].length > 0
//             ) {
//               ws.send(
//                 JSON.stringify({
//                   type: "quiz_results_update",
//                   questionIndex: questionIndex,
//                   responses: activeQuiz.responses[questionIndex],
//                   questionData: activeQuiz.questions[questionIndex],
//                 })
//               );
//             }
//           }
//         }

//         // If there's an active flashcard, send it to the educator
//         if (activeFlashcard.active) {
//           ws.send(
//             JSON.stringify({
//               type: "flashcard_active",
//               flashcard: activeFlashcard,
//               responses: activeFlashcard.responses,
//               skippedCount: activeFlashcard.skippedLearners.size,
//             })
//           );
//         }

//         if (attentionCheck.active) {
//           const timeRemaining = Math.max(
//             0,
//             60 - (Date.now() - attentionCheck.startTime) / 1000
//           );
//           ws.send(
//             JSON.stringify({
//               type: "attention_check",
//               question: attentionCheck.question,
//               options: attentionCheck.options,
//               timeRemaining: Math.round(timeRemaining),
//             })
//           );
//         }

//         // If there's an active doubt session, send it to the new learner
//         if (doubtSession.active) {
//           const timeRemaining = Math.max(
//             0,
//             90 - (Date.now() - doubtSession.startTime) / 1000
//           );
//           ws.send(
//             JSON.stringify({
//               type: "doubt_session",
//               timeRemaining: Math.round(timeRemaining),
//             })
//           );
//         }

//         // If there's an active AI test, send it to the educator
//         if (activeAITest.active) {
//           ws.send(
//             JSON.stringify({
//               type: "ai_test_active",
//               aiTest: {
//                 testType: activeAITest.testType,
//                 complexity: activeAITest.complexity,
//                 subTopics: activeAITest.subTopics,
//                 prompt: activeAITest.prompt,
//               },
//               learnerProgress: Array.from(activeAITest.learnerProgress).map(
//                 ([learnerId, progress]) => ({
//                   learnerId,
//                   learnerName: progress.learnerName,
//                   currentQuestionIndex: progress.currentQuestionIndex,
//                   report: progress.report,
//                 })
//               ),
//             })
//           );
//         }
//       } else if (ws.role === "learner") {
//         // Generate a unique ID for the learner
//         ws.learnerId = generateUniqueId();
//         ws.learnerName = message.name || "Anonymous";

//         // Add learner to active learners set
//         activeQuiz.activeLearners.add(ws.learnerId);

//         // Initialize learner at question 0 if quiz is active
//         if (activeQuiz.active) {
//           activeQuiz.learnerQuestions.set(ws.learnerId, 0);
//         }

//         console.log(`Learner connected: ${ws.learnerId} (${ws.learnerName})`);
//         console.log(
//           `Active learners: ${Array.from(activeQuiz.activeLearners).join(", ")}`
//         );

//         // Send current status to new learner
//         ws.send(
//           JSON.stringify({
//             type: "educator_status",
//             online: educatorOnline,
//             currentTopic: currentTopic,
//           })
//         );

//         // If there's an active quiz, send the first question to the new learner
//         if (activeQuiz.active && activeQuiz.questions.length > 0) {
//           const firstQuestion = activeQuiz.questions[0];
//           ws.send(
//             JSON.stringify({
//               type: "quiz_question",
//               question: firstQuestion.question,
//               options: firstQuestion.options,
//               questionIndex: 0,
//               totalQuestions: activeQuiz.questions.length,
//               timeLimit: 30,
//             })
//           );
//         }

//         // If there's an active flashcard, send it to the new learner
//         if (activeFlashcard.active) {
//           ws.send(
//             JSON.stringify({
//               type: "flashcard_display",
//               flashcard: {
//                 type: activeFlashcard.type,
//                 title: activeFlashcard.title,
//                 content: activeFlashcard.content,
//                 question: activeFlashcard.question,
//                 options: activeFlashcard.options,
//               },
//             })
//           );
//         }

//         // If there's an active AI test, and this learner hasn't completed it yet
//         if (
//           activeAITest.active &&
//           !activeAITest.completedLearners.has(ws.learnerId)
//         ) {
//           // Initialize learner in the AI test if not already
//           if (!activeAITest.learnerProgress.has(ws.learnerId)) {
//             activeAITest.learnerProgress.set(ws.learnerId, {
//               learnerName: ws.learnerName,
//               questions: [],
//               answers: [],
//               currentQuestionIndex: 0,
//               report: null,
//             });

//             // Generate first question for this learner
//             generateAITestQuestion(ws.learnerId, ws.learnerName, ws);
//           } else {
//             // Learner was already in progress, send the current question
//             const progress = activeAITest.learnerProgress.get(ws.learnerId);
//             if (progress.currentQuestionIndex < 5) {
//               ws.send(
//                 JSON.stringify({
//                   type: "ai_test_question",
//                   question: progress.questions[progress.currentQuestionIndex],
//                   questionIndex: progress.currentQuestionIndex,
//                   totalQuestions: 5,
//                   assistMode: activeAITest.testType === "assist",
//                 })
//               );
//             }
//           }
//         }
//       }
//     } else if (message.type === "select_topic") {
//       if (ws.role === "educator") {
//         currentTopic = message.topic;
//         // Broadcast selected topic to all learners
//         broadcastToLearners({ type: "topic_selected", topic: currentTopic });
//       }
//     } else if (message.type === "chat") {
//       // Regular chat message
//       wss.clients.forEach(function each(client) {
//         if (client !== ws && client.readyState === WebSocket.OPEN) {
//           client.send(JSON.stringify(message));
//         }
//       });
//     } else if (message.type === "generate_quiz") {
//       if (ws.role === "educator") {
//         // Generate quiz based on keywords
//         generateQuiz(message.keywords, ws);
//       }
//     } else if (message.type === "generate_flashcard") {
//       if (ws.role === "educator") {
//         // Generate flashcard content based on topics and type
//         generateFlashcard(
//           message.title,
//           message.subTopics,
//           message.cardType,
//           ws
//         );
//       }
//     } else if (message.type === "start_flashcard") {
//       if (ws.role === "educator") {
//         // Reset flashcard state
//         activeFlashcard = {
//           active: true,
//           type: message.flashcard.type,
//           title: message.flashcard.title,
//           content: message.flashcard.content,
//           subTopics: message.flashcard.subTopics,
//           question: message.flashcard.question || null,
//           options: message.flashcard.options || [],
//           correctAnswer: message.flashcard.correctAnswer || "",
//           modelAnswer: message.flashcard.modelAnswer || "",
//           responses: [],
//           respondedLearners: new Set(),
//           skippedLearners: new Set(), // Initialize empty set for skipped learners
//         };

//         // Send flashcard to all learners
//         broadcastToLearners({
//           type: "flashcard_display",
//           flashcard: {
//             type: activeFlashcard.type,
//             title: activeFlashcard.title,
//             content: activeFlashcard.content,
//             question: activeFlashcard.question,
//             options: activeFlashcard.options,
//           },
//         });

//         // Send confirmation to educator
//         ws.send(
//           JSON.stringify({
//             type: "flashcard_started",
//             flashcard: activeFlashcard,
//           })
//         );
//       }
//     } else if (message.type === "end_flashcard") {
//       if (ws.role === "educator") {
//         // End active flashcard
//         activeFlashcard.active = false;

//         // Notify all learners
//         broadcastToLearners({
//           type: "flashcard_ended",
//         });

//         // Send final results to educator
//         ws.send(
//           JSON.stringify({
//             type: "flashcard_ended",
//             responses: activeFlashcard.responses,
//             skippedCount: activeFlashcard.skippedLearners.size,
//           })
//         );
//       }
//     } else if (message.type === "submit_flashcard_answer") {
//       if (ws.role === "learner" && activeFlashcard.active) {
//         // Store response
//         const responseObj = {
//           learnerId: ws.learnerId,
//           learnerName: ws.learnerName,
//           answer: message.answer,
//           timestamp: new Date().toISOString(),
//         };

//         activeFlashcard.responses.push(responseObj);
//         activeFlashcard.respondedLearners.add(ws.learnerId);

//         // Send acknowledgment to learner with thank you message
//         ws.send(
//           JSON.stringify({
//             type: "flashcard_answer_received",
//             message:
//               "Thank you for your submission! Your response has been recorded.",
//           })
//         );

//         // Send updated results to educator
//         wss.clients.forEach(function each(client) {
//           if (
//             client.role === "educator" &&
//             client.readyState === WebSocket.OPEN
//           ) {
//             client.send(
//               JSON.stringify({
//                 type: "flashcard_response_update",
//                 response: responseObj,
//                 responses: activeFlashcard.responses,
//                 skippedCount: activeFlashcard.skippedLearners.size,
//               })
//             );
//           }
//         });
//       }
//     } else if (message.type === "skip_flashcard") {
//       if (ws.role === "learner" && activeFlashcard.active) {
//         // Mark as skipped
//         activeFlashcard.skippedLearners.add(ws.learnerId);

//         // Send acknowledgment to learner
//         ws.send(
//           JSON.stringify({
//             type: "flashcard_skipped",
//             message: "You've skipped this flashcard.",
//           })
//         );

//         // Notify educator about the skip
//         wss.clients.forEach(function each(client) {
//           if (
//             client.role === "educator" &&
//             client.readyState === WebSocket.OPEN
//           ) {
//             client.send(
//               JSON.stringify({
//                 type: "flashcard_skip_update",
//                 learnerId: ws.learnerId,
//                 learnerName: ws.learnerName,
//                 skippedCount: activeFlashcard.skippedLearners.size,
//                 timestamp: new Date().toISOString(),
//               })
//             );
//           }
//         });
//       }
//     } else if (message.type === "start_quiz") {
//       if (ws.role === "educator") {
//         // Preserve active learners when starting a new quiz
//         const activeLearners = activeQuiz.activeLearners;

//         // Start the quiz with custom or generated questions
//         activeQuiz = {
//           active: true,
//           questions: message.questions,
//           currentQuestionIndex: 0,
//           responses: {},
//           activeLearners: activeLearners, // Preserve active learners
//           respondedLearners: new Set(), // Reset responded learners
//           learnerQuestions: new Map(), // Reset learner questions
//           learnerResponses: new Map(), // Reset learner responses
//         };

//         // Initialize all active learners at question 0
//         activeLearners.forEach((learnerId) => {
//           activeQuiz.learnerQuestions.set(learnerId, 0);
//           activeQuiz.learnerResponses.set(learnerId, []);
//         });

//         console.log(
//           `Starting quiz with active learners: ${Array.from(
//             activeQuiz.activeLearners
//           ).join(", ")}`
//         );

//         // Initialize response tracking for each question
//         activeQuiz.questions.forEach((_, index) => {
//           activeQuiz.responses[index] = [];
//         });

//         // Send first question to all learners
//         const firstQuestion = activeQuiz.questions[0];
//         broadcastToLearners({
//           type: "quiz_question",
//           question: firstQuestion.question,
//           options: firstQuestion.options,
//           questionIndex: 0,
//           totalQuestions: activeQuiz.questions.length,
//           timeLimit: 30,
//         });

//         // Send confirmation to educatorq
//         ws.send(
//           JSON.stringify({
//             type: "quiz_started",
//             totalQuestions: activeQuiz.questions.length,
//             questions: activeQuiz.questions,
//           })
//         );
//       }
//     } else if (message.type === "end_quiz") {
//       if (ws.role === "educator" && activeQuiz.active) {
//         // End quiz immediately
//         activeQuiz.active = false;

//         // Notify all learners
//         broadcastToLearners({
//           type: "quiz_ended",
//           message: "The teacher has ended the quiz.",
//         });

//         // Send final results to educator
//         ws.send(
//           JSON.stringify({
//             type: "quiz_ended",
//             finalResults: activeQuiz.responses,
//             questions: activeQuiz.questions,
//           })
//         );
//       }
//     } else if (message.type === "next_question") {
//       if (ws.role === "educator" && activeQuiz.active) {
//         // This is only used when the educator manually advances all learners
//         const nextIndex = activeQuiz.currentQuestionIndex + 1;

//         if (nextIndex < activeQuiz.questions.length) {
//           activeQuiz.currentQuestionIndex = nextIndex;

//           // Reset responded learners for new question
//           activeQuiz.respondedLearners.clear();

//           const nextQuestion = activeQuiz.questions[nextIndex];

//           // Move all learners to the next question
//           activeQuiz.activeLearners.forEach((learnerId) => {
//             activeQuiz.learnerQuestions.set(learnerId, nextIndex);
//           });

//           // Send next question to all learners
//           broadcastToLearners({
//             type: "quiz_question",
//             question: nextQuestion.question,
//             options: nextQuestion.options,
//             questionIndex: nextIndex,
//             totalQuestions: activeQuiz.questions.length,
//             timeLimit: 30,
//           });

//           // Send confirmation to educator
//           ws.send(
//             JSON.stringify({
//               type: "question_changed",
//               currentIndex: nextIndex,
//             })
//           );
//         } else {
//           // End of quiz
//           activeQuiz.active = false;

//           // Notify all learners
//           broadcastToLearners({
//             type: "quiz_ended",
//             message: "The quiz has ended.",
//           });

//           // Send final results to educator
//           ws.send(
//             JSON.stringify({
//               type: "quiz_ended",
//               finalResults: activeQuiz.responses,
//               questions: activeQuiz.questions,
//             })
//           );
//         }
//       }
//     } else if (message.type === "submit_answer") {
//       if (ws.role === "learner" && activeQuiz.active) {
//         const { questionIndex, answer, isTimeout, isSkipped } = message;

//         console.log("Received answer:", {
//           learnerId: ws.learnerId,
//           questionIndex,
//           answer,
//           isTimeout,
//           isSkipped,
//         });

//         // Make sure responses array exists for this question
//         if (!activeQuiz.responses[questionIndex]) {
//           activeQuiz.responses[questionIndex] = [];
//         }

//         // Store response
//         const responseObj = {
//           learnerId: ws.learnerId,
//           learnerName: ws.learnerName,
//           answer: answer || "No Answer", // Ensure there's always a value
//           timestamp: new Date().toISOString(),
//         };

//         activeQuiz.responses[questionIndex].push(responseObj);

//         // Store in learner's individual response array
//         const learnerResponses =
//           activeQuiz.learnerResponses.get(ws.learnerId) || [];
//         learnerResponses[questionIndex] = responseObj;
//         activeQuiz.learnerResponses.set(ws.learnerId, learnerResponses);

//         // Add learner to responded set
//         activeQuiz.respondedLearners.add(ws.learnerId);

//         // Send acknowledgment to the learner
//         ws.send(
//           JSON.stringify({
//             type: "answer_received",
//             questionIndex: questionIndex,
//             message:
//               "Thank you for your answer. Your response has been recorded.",
//           })
//         );

//         // Send updated results to educator
//         wss.clients.forEach(function each(client) {
//           if (
//             client.role === "educator" &&
//             client.readyState === WebSocket.OPEN
//           ) {
//             client.send(
//               JSON.stringify({
//                 type: "quiz_results_update",
//                 questionIndex: questionIndex,
//                 responses: activeQuiz.responses[questionIndex],
//                 questionData: activeQuiz.questions[questionIndex],
//               })
//             );
//           }
//         });

//         // Check if this learner should move to next question
//         // const currentLearnerQuestion =
//         //   activeQuiz.learnerQuestions.get(ws.learnerId) || 0;
//         // const nextQuestionIndex = currentLearnerQuestion + 1;

//         // If there's a next question, send it to this learner
//         // if (nextQuestionIndex < activeQuiz.questions.length) {
//         // Update the learner's current question
//         // activeQuiz.learnerQuestions.set(ws.learnerId, nextQuestionIndex);

//         // const nextQuestion = activeQuiz.questions[nextQuestionIndex];

//         // console.log(
//         //   `Moving learner ${ws.learnerId} to question ${nextQuestionIndex}`
//         // );

//         // Send next question to this specific learner
//         // ws.send(
//         //   JSON.stringify({
//         //     type: "quiz_question",
//         //     question: nextQuestion.question,
//         //     options: nextQuestion.options,
//         //     questionIndex: nextQuestionIndex,
//         //     totalQuestions: activeQuiz.questions.length,
//         //     timeLimit: 30,
//         //   })
//         // );
//       } else if (ws.role === "learner" && attentionCheck.active) {
//         attentionCheck.responses[ws.learnerId] = message.answer;
//       } else {
//         // This learner has completed all questions
//         console.log(`Learner ${ws.learnerId} has completed all questions`);

//         // Tell this learner they've completed the quiz
//         ws.send(
//           JSON.stringify({
//             type: "quiz_completed",
//             message:
//               "You have completed all questions. Thank you for participating!",
//           })
//         );

//         // Check if all learners have completed all questions
//         let allCompleted = true;
//         for (const [
//           learnerId,
//           questionIndex,
//         ] of activeQuiz.learnerQuestions.entries()) {
//           if (questionIndex < activeQuiz.questions.length - 1) {
//             allCompleted = false;
//             break;
//           }
//         }

//         // If all learners have completed all questions, end the quiz
//         if (allCompleted && activeQuiz.activeLearners.size > 0) {
//           activeQuiz.active = false;

//           // Notify all learners
//           broadcastToLearners({
//             type: "quiz_ended",
//             message: "The quiz has ended. Thank you for participating!",
//           });

//           // Send final results to educator
//           wss.clients.forEach(function each(client) {
//             if (
//               client.role === "educator" &&
//               client.readyState === WebSocket.OPEN
//             ) {
//               client.send(
//                 JSON.stringify({
//                   type: "quiz_ended",
//                   finalResults: activeQuiz.responses,
//                   questions: activeQuiz.questions,
//                 })
//               );
//             }
//           });
//         }
//       }
//     } else if (message.type === "clear_quiz_responses") {
//       if (ws.role === "educator") {
//         // Clear responses for a specific question or all questions
//         if (message.questionIndex !== undefined) {
//           // Clear responses for a specific question
//           activeQuiz.responses[message.questionIndex] = [];

//           // Notify educator
//           ws.send(
//             JSON.stringify({
//               type: "quiz_results_update",
//               questionIndex: message.questionIndex,
//               responses: [],
//               questionData: activeQuiz.questions[message.questionIndex],
//             })
//           );
//         } else {
//           // Clear all responses
//           activeQuiz.questions.forEach((_, index) => {
//             activeQuiz.responses[index] = [];
//           });

//           // Notify educator of all cleared responses
//           activeQuiz.questions.forEach((question, index) => {
//             ws.send(
//               JSON.stringify({
//                 type: "quiz_results_update",
//                 questionIndex: index,
//                 responses: [],
//                 questionData: question,
//               })
//             );
//           });
//         }
//       }
//     } else if (message.type === "cancel_flashcard_generation") {
//       if (ws.role === "educator") {
//         console.log("Received flashcard generation cancellation request");
//         // This is just to acknowledge the cancellation, the actual cancellation
//         // is handled client-side by cleaning up the UI state
//       }
//     } else if (message.type === "generate_ai_test") {
//       if (ws.role === "educator") {
//         // Reset AI test state
//         activeAITest = {
//           active: true,
//           testType: message.testType,
//           complexity: message.complexity,
//           subTopics: message.subTopics,
//           prompt: message.prompt || "",
//           currentQuestion: null,
//           currentLearner: null,
//           learnerProgress: new Map(),
//           completedLearners: new Set(),
//         };

//         // Notify educator
//         ws.send(
//           JSON.stringify({
//             type: "ai_test_generated",
//             aiTest: {
//               testType: activeAITest.testType,
//               complexity: activeAITest.complexity,
//               subTopics: activeAITest.subTopics,
//               prompt: activeAITest.prompt,
//             },
//           })
//         );

//         // Notify all learners
//         broadcastToLearners({
//           type: "ai_test_started",
//           testType: activeAITest.testType,
//           message:
//             activeAITest.testType === "normal"
//               ? "Your teacher has started an AI assessment. Be ready to answer some questions!"
//               : "Your teacher has started an AI-assisted learning session. You'll be asked questions and receive feedback.",
//         });
//       }
//     } else if (message.type === "end_ai_test") {
//       if (ws.role === "educator" && activeAITest.active) {
//         // End AI test
//         activeAITest.active = false;

//         // Create a summary of results to return to educator
//         const results = Array.from(activeAITest.learnerProgress.entries()).map(
//           ([learnerId, progress]) => ({
//             learnerId,
//             learnerName: progress.learnerName,
//             questionsAnswered: progress.currentQuestionIndex,
//             report: progress.report,
//             questions: progress.questions,
//             answers: progress.answers,
//           })
//         );

//         // Notify all learners
//         broadcastToLearners({
//           type: "ai_test_ended",
//           message: "The AI test session has ended.",
//         });

//         // Send results to educator
//         ws.send(
//           JSON.stringify({
//             type: "ai_test_ended",
//             results: results,
//           })
//         );
//       }
//     } else if (message.type === "submit_ai_test_answer") {
//       if (ws.role === "learner" && activeAITest.active) {
//         // Store the learner's answer
//         const progress = activeAITest.learnerProgress.get(ws.learnerId);

//         if (progress) {
//           progress.answers.push(message.answer);

//           // Process the answer and determine the next question or generate a report
//           processAITestAnswer(ws.learnerId, ws.learnerName, message.answer, ws);
//         }
//       }
//     } else if (message.type === "launch_interest_investigation") {
//       if (ws.role === "educator") {
//         broadcastToLearners({
//           type: "interest_display",
//           question: message.question,
//           investigation_type: message.investigation_type,
//         });
//         ws.send(
//           JSON.stringify({
//             type: "interest_investigation_started",
//           })
//         );
//       }
//     } else if (message.type === "submit_interest_answer") {
//       if (ws.role === "learner") {
//         console.log("Received interest answer:", message.answer);

//         wss.clients.forEach(function each(client) {
//           if (
//             client.role === "educator" &&
//             client.readyState === WebSocket.OPEN
//           ) {
//             client.send(
//               JSON.stringify({
//                 type: "interest_answer_received",
//                 response: message.answer,
//                 learnerName: message.learnerName,
//                 id: ws.learnerId,
//               })
//             );
//           }
//         });
//       }
//     } else if (message.type === "launch_doubt_session") {
//       if (ws.role === "educator") {
//         // Start a new doubt session
//         doubtSession = {
//           active: true,
//           startTime: Date.now(),
//           doubts: [],
//           timeoutId: setTimeout(() => processDoubts(ws), 45000), // 90 seconds
//         };

//         // Notify all learners
//         broadcastToLearners({
//           type: "doubt_session",
//           timeRemaining: 90,
//         });
//       }
//     } else if (message.type === "submit_doubt") {
//       if (ws.role === "learner" && doubtSession.active) {
//         doubtSession.doubts.push(message.doubt);
//       }
//     } else if (message.type === "launch_attention_check") {
//       if (ws.role === "educator") {
//         attentionCheck = {
//           active: true,
//           question: message.question,
//           options: message.options,
//           startTime: Date.now(),
//           responses: {},
//           timeoutId: setTimeout(() => processAttentionCheck(ws), 60000), // 60 seconds
//         };
//         // Notify all learners
//         broadcastToLearners({
//           type: "attention_check",
//           question: message.question,
//           options: message.options,
//           timeRemaining: 60,
//         });
//       }
//     }
//   } catch (error) {
//     console.error("Error processing message:", error);
//   }
// }

export default messageParameters;
