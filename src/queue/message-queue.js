// messageQueue.js
import { Queue } from "bullmq";
import connection from "../db.js";
const messageQueue = new Queue("message-queue", {
  connection,
});
export default messageQueue;
