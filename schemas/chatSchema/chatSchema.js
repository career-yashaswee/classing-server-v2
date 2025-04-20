import mongoose from "mongoose";

// User Schema (For both Teachers and Students)
const userSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "UserSchema" },
});

// Chat Room Schema (One-to-One or Group Chat)
const chatRoomSchema = new mongoose.Schema({
  isGroupChat: { type: Boolean, default: false },
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ], // Users in the chat
  groupName: { type: String, default: null }, // Only for group chats
  groupAdmin: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "User",

    default: null,
  }, // Only for group chats
  createdAt: { type: Date, default: Date.now },
});

// Message Schema (Chat Messages)
const messageSchema = new mongoose.Schema({
  chatRoom: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "ChatRoom",

    required: true,
  }, // Which chat it belongs to
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Message sender
  messageType: {
    type: String,

    enum: ["text", "image", "file"],

    default: "text",
  }, // Message Type
  content: { type: String, required: true }, // Message Content
  fileUrl: { type: String, default: null }, // For images/files
  isRead: { type: Boolean, default: false },
  isDelivered: { type: Boolean, default: false },
  isSent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Exporting Models
const User = mongoose.model("User", userSchema);
const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);
const Message = mongoose.model("Message", messageSchema);

export { User, ChatRoom, Message };

// JSON Format :

// // USER
// {
//   "_id": "65c8d1f9e73a3d1a5c9f1b4c",
//   "user": "65c8d1f9e73a3d1a5c9f1b4d"
// }

// // Chat ROOM :
// // One by One :
// {
//   "_id": "65c8d1f9e73a3d1a5c9f1b5e",
//   "isGroupChat": false,
//   "participants": [
//     "65c8d1f9e73a3d1a5c9f1b4c",
//     "65c8d1f9e73a3d1a5c9f1b4d"
//   ],
//   "groupName": null,
//   "groupAdmin": null,
//   "createdAt": "2025-02-22T10:30:00.000Z"
// }
// // Group Chat :
// {
//   "_id": "65c8d1f9e73a3d1a5c9f1b6f",
//   "isGroupChat": true,
//   "participants": [
//     "65c8d1f9e73a3d1a5c9f1b4c",
//     "65c8d1f9e73a3d1a5c9f1b4d",
//     "65c8d1f9e73a3d1a5c9f1b5e"
//   ],
//   "groupName": "Math Study Group",
//   "groupAdmin": "65c8d1f9e73a3d1a5c9f1b4c",
//   "createdAt": "2025-02-22T10:30:00.000Z"
// }

// // MESSAGE :
// // TEXT :
// {
//   "_id": "65c8d1f9e73a3d1a5c9f1b7g",
//   "chatRoom": "65c8d1f9e73a3d1a5c9f1b5e",
//   "sender": "65c8d1f9e73a3d1a5c9f1b4c",
//   "messageType": "text",
//   "content": "Hello! How are you?",
//   "fileUrl": null,
//   "isRead": false,
//   "isDelivered": false,
//   "isSent": true,
//   "createdAt": "2025-02-22T10:31:00.000Z"
// }
// // IMAGE/FILE :
// {
//   "_id": "65c8d1f9e73a3d1a5c9f1b8h",
//   "chatRoom": "65c8d1f9e73a3d1a5c9f1b6f",
//   "sender": "65c8d1f9e73a3d1a5c9f1b4d",
//   "messageType": "image",
//   "content": "Check this image!",
//   "fileUrl": "https://example.com/image.png",
//   "isRead": true,
//   "isDelivered": true,
//   "isSent": true,
//   "createdAt": "2025-02-22T10:35:00.000Z"
// }
