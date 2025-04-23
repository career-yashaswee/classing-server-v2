import chalk from "chalk";

const LOG = {
  DB: {
    DB_REDIS_ERROR: chalk.red.bgRed.bold("✗ DB_REDIS_FAIL"),
    DB_REDIS_SUCCESS: chalk.green.bgGreen.bold.italic("✓ DB_REDIS_SUCCESS"),
    DB_MONGODB_ERROR: chalk.red.bgRed.bold("✗ DB_MONGODB_FAIL"),
    DB_MONGODB_SUCCESS: chalk.green.bgGreen.bold.italic("✓ DB_MONGODB_SUCCESS"),
    MONGODB_URI_ERROR: chalk.red.bgRed.bold("✗ MONGODB_URI_NOT_FOUND"),
  },

  SOCKET: {
    EVENT: {
      UNRECOGNIZED_EVENT: chalk.red.bgRed.bold("✗ UNRECOGNIZED_EVENT"),
    },
  },
  QUEUE: {
    ENQUED_SUCCESS: chalk.green.bgGreen.bold.italic("✓ ENQUED_SUCCESS"),
    ENQUED_ERROR: chalk.red.bgRed.bold("✗ ENQUED_FAILED"),
    JOB_SUCCESS: (id) => chalk.green.bgGreen.bold.italic(`✓ JOB_SUCCESS ${id}`),
    JOB_ERROR: (id) => chalk.red.bgRed.bold(`✗ JOB_FAILED ${id}`),
    JOB_PROGRESS: (id) => chalk.yellow.bgYellow.bold(`! JOB_PROGRESS ${id}`),
  },
  AI: {
    OLLAMA_CONFIG_SUCCESS: chalk.green.bgGreen.bold.italic(
      "✓ OLLAMA_CONFIG_SUCCESS"
    ),
    OLLAMA_CONFIG_ERROR: chalk.red.bgRed.bold("✗ OLLAMA_CONFIG_FAIL"),
    GEMINI_KEY_ERROR: chalk.red.bgRed.bold("✗ GEMINI_API_KEY_NOT_FOUND"),
    AI_KEY_RESORT: chalk.yellow.bgYellow.bold("! Resorting To Default AI Key"),
  },
};

export default LOG;
