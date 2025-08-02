import { GoogleGenerativeAI } from "@google/generative-ai";
import { randomInt } from "crypto";

const keys = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY2,
  process.env.GEMINI_API_KEY1,
].filter(Boolean); // Filters out undefined keys

if (keys.length === 0) {
  throw new Error("No valid GEMINI_API_KEYs are set in environment variables.");
}

async function generateResponse(
  prompt: string,
  inputData: string,
  index: number = randomInt(0, keys.length)
): Promise<string> {
  const apiKey = keys[index];

  if (!apiKey) {
    throw new Error("API key is undefined at selected index");
  }

  const genAI = new GoogleGenerativeAI(apiKey).getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  try {
    const result = await genAI.generateContent(`${prompt}\n\n${inputData}`);
    const response = result.response;
    const answer = response.text();

    return answer.trim();
  } catch (err) {
    const newIndex = (index + 1) % keys.length;
    console.warn(`Error from API key at index ${index}: ${err}. Retrying with index ${newIndex}`);
    if (newIndex !== index) {
      return generateResponse(prompt, inputData, newIndex);
    }
    throw new Error("All API keys failed to produce a valid response.");
  }
}

export default generateResponse;
