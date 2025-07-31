import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "").getGenerativeModel({ model: "gemini-2.5-flash" })
export default genAI