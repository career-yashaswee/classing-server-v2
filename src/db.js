import { Redis } from "ioredis";
import chalk from "chalk";
import dotenv from "dotenv";
import LOG from "./log/LOG.js";
import mongoose from "mongoose";
dotenv.config();

const connection = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null,
});

connection.on("connect", () => {
  console.log(LOG.DB.DB_REDIS_SUCCESS);
});
connection.on("error", (err) => {
  console.log(LOG.DB.DB_REDIS_ERROR, err);
});

// --MONGODB CONNECTION--
const mongoURI = process.env.MONGODB_URI; // "mongodb://localhost:27017/classing" for LOCAL SERVER
// const mongoURI = process.env.MONGODB_LOCAL_URI;
if (!mongoURI) {
  console.error(LOG.MONGODB_URI_ERROR);
  process.exit(1);
}

mongoose
  .connect(mongoURI)
  .then(() => console.log(LOG.DB.DB_MONGODB_SUCCESS))
  .catch((err) => {
    console.error(LOG.DB.DB_MONGODB_ERROR, err);
    process.exit(1);
  });

export default connection;
