import { GoogleGenerativeAI } from "@google/generative-ai";
import LOG from "./log/LOG.js";

let key = process.env.GEMINI_API_KEY;
if (!key) {
  console.log(LOG.AI.GEMINI_KEY_ERROR);
  console.log(LOG.AI.AI_KEY_RESORT);
  key = "AIzaSyCjHojFiuSOam4L-M0rgRHprP36Lf8l7rA";
}

const TEST_LOCAL_LLM = async () => {
  try {
    const response = await fetch("http://localhost:11434");
    const text = await response.text();
    console.log(text);
    if (text.includes("Ollama is running")) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

if (TEST_LOCAL_LLM) {
  console.log(LOG.AI.OLLAMA_CONFIG_SUCCESS);
} else {
  console.log(LOG.AI.OLLAMA_CONFIG_ERROR);
}
const ai = new GoogleGenerativeAI(key);
export default ai;
