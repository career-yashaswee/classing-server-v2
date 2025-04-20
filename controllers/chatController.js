import { User, ChatRoom, Message } from "../schemas/chatSchema/chatSchema.js"; // Adjust path as needed
// import mongoose from "mongoose";

// // Create a New User
// const createUser = async (req, res) => {
//   try {
//     const { userId } = req.body;
//     const user = new User({ user: userId });
//     await user.save();
//     res.status(201).json({ success: true, message: "User created", user });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("user");
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create a New Chat Room
const createChatRoom = async (req, res) => {
  try {
    const { isGroupChat, participants, groupName, groupAdmin } = req.body;
    const chatRoom = new ChatRoom({ isGroupChat, participants, groupName, groupAdmin });
    await chatRoom.save();
    res.status(201).json({ success: true, message: "Chat room created", chatRoom });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get All Chat Rooms for a User
const getUserChatRooms = async (req, res) => {
  try {
    const { userId } = req.params;
    const chatRooms = await ChatRoom.find({ participants: userId }).populate("participants groupAdmin");
    res.status(200).json({ success: true, chatRooms });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Send a Message
const sendMessage = async (req, res) => {
  try {
    const { chatRoom, sender, messageType, content, fileUrl } = req.body;
    const message = new Message({ chatRoom, sender, messageType, content, fileUrl, isSent: true });
    await message.save();
    res.status(201).json({ success: true, message: "Message sent", message });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get Messages for a Chat Room
const getChatMessages = async (req, res) => {
  try {
    const { chatRoomId } = req.params;
    const messages = await Message.find({ chatRoom: chatRoomId }).populate("sender chatRoom");
    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Mark Messages as Read
const markMessagesAsRead = async (req, res) => {
  try {
    const { chatRoomId, userId } = req.params;
    await Message.updateMany({ chatRoom: chatRoomId, sender: { $ne: userId } }, { isRead: true });
    res.status(200).json({ success: true, message: "Messages marked as read" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete a Message
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    await Message.findByIdAndDelete(messageId);
    res.status(200).json({ success: true, message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export default  {
//   createUser,
  getAllUsers,
  createChatRoom,
  getUserChatRooms,
  sendMessage,
  getChatMessages,
  markMessagesAsRead,
  deleteMessage
};
