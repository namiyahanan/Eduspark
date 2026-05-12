import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";

if (!API_KEY) {
  console.error("No GEMINI_API_KEY found in .env file.");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

async function checkModel() {
  try {
    console.log("Testing API Key...");
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: "Respond with 'Connected' if you can read this."
    });
    
    console.log("Success! Your API key is active.");
    console.log("Model being used: gemini-2.0-flash (Available in Free Tier)");
    console.log("AI Response:", response.candidates?.[0]?.content?.parts?.[0]?.text);
    
    console.log("\nNote: Gemini 2.0 Flash is part of the free tier in Google AI Studio.");
    console.log("To check your billing status, visit: https://aistudio.google.com/app/billing");
  } catch (error: any) {
    console.error("Error testing API key:", error.message);
    if (error.message.includes("429")) {
      console.log("Insight: You are likely on the Free Tier and have hit a rate limit.");
    }
  }
}

checkModel();
