import { GoogleGenerativeAI } from "@google/generative-ai";
import LOG from "./log/LOG.js";
import { testLocalLLM } from "./functions/ai/test.js";

let key = process.env.GEMINI_API_KEY;
if (!key) {
  console.log(LOG.AI.GEMINI_KEY_ERROR);
  console.log(LOG.AI.AI_KEY_RESORT);
  key = "AIzaSyCjHojFiuSOam4L-M0rgRHprP36Lf8l7rA";
}

testLocalLLM().then((success) => {
  if (success) {
    console.log(LOG.AI.OLLAMA_CONFIG_SUCCESS);
  } else {
    console.log(LOG.AI.OLLAMA_CONFIG_ERROR);
  }
});

const ai = new GoogleGenerativeAI(key);
export default ai;
