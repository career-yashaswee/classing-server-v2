import mongoose from "mongoose";

// Avatar Conversation Schema.
const conversationSchema = new mongoose.Schema({
  messageId: { type: String, required: true },
  sender: { type: String, enum: ["USER", "Avatar", "Teacher"], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, required: true },
});

export { conversationSchema };

// JSON Format : 
// 
// {
//     "messageId": "msg_001",
//     "sender": "USER",
//     "text": "Hello, how are you?",
//     "timestamp": "2025-02-22T10:30:00.000Z"
// }
  