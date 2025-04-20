import mongoose from "mongoose";
import { conversationSchema } from "./conversionSchema.js";

// Avatar Schema.
const avatarSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, auto: true },
  sessionId: { type: String, required: true },
  conversation: { type: [conversationSchema], required: true }
});

// Export the Model
const AvatarSession = mongoose.model("AvatarSession", avatarSessionSchema);
export default AvatarSession;

// JSON Format : 
// 
// {
//   "userId": "65c8d1f9e73a3d1a5c9f1b4c",
//   "sessionId": "session_12345",
//   "conversation": [
//     {
//       "messageId": "msg_001",
//       "sender": "USER",
//       "text": "Hello, how are you?",
//       "timestamp": "2025-02-22T10:30:00.000Z"
//     },
//     {
//       "messageId": "msg_002",
//       "sender": "Avatar",
//       "text": "I'm here to assist you. How can I help?",
//       "timestamp": "2025-02-22T10:30:05.000Z"
//     },
//     {
//       "messageId": "msg_003",
//       "sender": "Teacher",
//       "text": "Let's focus on the lesson.",
//       "timestamp": "2025-02-22T10:30:10.000Z"
//     }
//   ]
// }
