import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const httpServer = app.listen(8080);
const wss = new WebSocketServer({ server: httpServer });

// Initialize Gemini API
const genAI = new GoogleGenerativeAI("AIzaSyBpceBcqjyXeOdAMEx-dwZOlnWiu-_z_SA"); // Replace with your actual API key

// Track state
let educatorOnline = false;
let currentTopic = null;

// Doubts
let doubtSession = {
  active: false,

  startTime: null,

  doubts: [],

  timeoutId: null,
};
// Attention

let attentionCheck = {
  active: false,

  question: null,

  options: [],

  startTime: null,

  responses: {},

  timeoutId: null,
};

let activeQuiz = {
  active: false,
  questions: [],
  currentQuestionIndex: -1,
  responses: {},
  activeLearners: new Set(), // Track connected learners
  respondedLearners: new Set(), // Track learners who responded to current question
  learnerQuestions: new Map(), // Map of learnerId -> current question index
  learnerResponses: new Map(), // Track each learner's responses
};

// Flashcard state
let activeFlashcard = {
  active: false,
  type: null, // 'quiz', 'content', or 'qa' (question/answer)
  title: "",
  content: "",
  subTopics: [],
  question: null,
  options: [],
  correctAnswer: "",
  responses: [],
  respondedLearners: new Set(),
  skippedLearners: new Set(), // Track learners who skipped
};

// AI Test state
let activeAITest = {
  active: false,
  testType: null, // 'normal' or 'assist'
  complexity: null, // 'easy', 'medium', or 'hard'
  subTopics: [],
  prompt: "",
  currentQuestion: null,
  currentLearner: null,
  learnerProgress: new Map(), // Map of learnerId -> { questions: [], answers: [], currentQuestionIndex, report }
  completedLearners: new Set(),
};

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  ws.on("message", function message(data, isBinary) {
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
            `Active learners: ${Array.from(activeQuiz.activeLearners).join(
              ", "
            )}`
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

          // Send confirmation to educator
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
          const results = Array.from(
            activeAITest.learnerProgress.entries()
          ).map(([learnerId, progress]) => ({
            learnerId,
            learnerName: progress.learnerName,
            questionsAnswered: progress.currentQuestionIndex,
            report: progress.report,
            questions: progress.questions,
            answers: progress.answers,
          }));

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
            processAITestAnswer(
              ws.learnerId,
              ws.learnerName,
              message.answer,
              ws
            );
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
            timeoutId: setTimeout(() => processDoubts(ws), 90000), // 90 seconds
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
  });

  // When a client disconnects
  ws.on("close", function () {
    if (ws.role === "educator") {
      educatorOnline = false;

      // Clear any active sessions
      if (doubtSession.timeoutId) {
        clearTimeout(doubtSession.timeoutId);
      }
      if (attentionCheck.timeoutId) {
        clearTimeout(attentionCheck.timeoutId);
      }

      // Reset sessions
      doubtSession.active = false;
      attentionCheck.active = false;

      // Notify all learners that educator is offline
      broadcastToLearners({ type: "educator_status", online: false });

      // Reset active quiz status but keep the learners set
      activeQuiz.active = false;

      // End active flashcard
      activeFlashcard.active = false;

      // Notify all learners that educator is offline
      broadcastToLearners({ type: "educator_status", online: false });
    } else if (ws.role === "learner" && ws.learnerId) {
      // Remove learner from active learners
      activeQuiz.activeLearners.delete(ws.learnerId);

      // Remove learner from question tracking
      activeQuiz.learnerQuestions.delete(ws.learnerId);

      // Remove from responded learners if present
      activeQuiz.respondedLearners.delete(ws.learnerId);

      // Remove learner responses
      activeQuiz.learnerResponses.delete(ws.learnerId);

      // Remove from flashcard responded learners if present
      activeFlashcard.respondedLearners.delete(ws.learnerId);

      // Remove from flashcard skipped learners if present
      activeFlashcard.skippedLearners.delete(ws.learnerId);

      console.log(`Learner disconnected: ${ws.learnerId}`);
    }
  });

  // Send welcome message
  ws.send(
    JSON.stringify({ type: "welcome", message: "Connected to Classing!" })
  );
});

// Function to broadcast messages only to learners
function broadcastToLearners(message) {
  const messageStr = JSON.stringify(message);
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN && client.role === "learner") {
      client.send(messageStr);
    }
  });
}

// Function to generate a unique ID for learners
function generateUniqueId() {
  return Math.random().toString(36).substring(2, 10);
}

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
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

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

// Function to process an AI test answer
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

      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
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
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
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

// Process attention check responses

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
console.log("Server is running on http://localhost:8080");
