import express from "express";
const router = express.Router();

import chatController from "../controllers/chatController.js";
// import { User, ChatRoom, Message } from "../schemas/chatSchema/chatSchema.js"; // Adjust path as needed

// User Routes
// router.post("/user", chatController.createUser);

router.get("/user", chatController.getAllUsers);
// Chat Room Routes
router.post("/chatroom", chatController.createChatRoom);
router.get("/chatroom/:userId", chatController.getUserChatRooms);

// Message Routes
router.post("/message", chatController.sendMessage);
router.get("/message/:chatRoomId", chatController.getChatMessages);
router.put("/message/read/:chatRoomId/:userId", chatController.markMessagesAsRead);
router.delete("/message/:messageId", chatController.deleteMessage);

export default router;
