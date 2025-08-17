import { GoogleGenerativeAI } from "@google/generative-ai";

const keys = [
  "AIzaSyAbj9NTxB1H2zjJxdwLDPXg3B8q3fLmGto",
  "AIzaSyB8aDnGpvRqwir2k3DaIoVK_5yiVdYANtw",
  "AIzaSyDJuRWxkvBskaMhBNLhgzir_RuTMel7jT8",
]

async function generateResponse(
  prompt: string,
  inputData: string,
  index?: number
): Promise<string> {
  // Pick random index if none is provided
  if (index === undefined) {
    index = Math.floor(Math.random() * keys.length);
  }

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
