// messageWorker.js
import { Worker } from "bullmq";
import connection from "../db.js";
import wsConnections from "../socket/wsConnections.js";
import messagefn from "../functions/messsageHandler.js";
import messsageHandler from "../functions/messsageHandler.js";
import LOG from "../log/LOG.js";

const worker = new Worker(
  "message-queue",
  async (job) => {
    const { clientId, data } = job.data;
    const ws = wsConnections.get(clientId);
    if (ws && ws.readyState === ws.OPEN) {
      await messsageHandler(ws, data);
    } else {
      console.warn(`Client ${clientId} is not connected`);
    }
  },
  {
    connection,
    concurrency: 1,
  }
);
worker.on("progress", (job) => {
  console.log(LOG.QUEUE.JOB_PROGRESS(job.id));
});

worker.on("completed", (job) => {
  console.log(LOG.QUEUE.JOB_SUCCESS(job.id));
});

worker.on("failed", (job, err) => {
  console.log(LOG.QUEUE.JOB_ERROR(job.id));
});
