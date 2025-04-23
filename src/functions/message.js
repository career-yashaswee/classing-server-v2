import LOG from "../log/LOG.js";
import messageQueue from "../queue/message-queue.js";

const message = (ws) => {
  const clientId = ws.clientId;
  console.log(clientId);
  return async (data, isBinary) => {
    try {
      data = JSON.parse(data.toString());
      await messageQueue.add("incoming-message", {
        clientId,
        data,
        isBinary,
      });
      console.error(LOG.QUEUE.ENQUED_SUCCESS);
    } catch (err) {
      console.error(LOG.QUEUE.ENQUED_ERROR, err);
    }
  };
};

export default message;
