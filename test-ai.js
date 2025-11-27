import { GoogleGenAI } from "@google/genai";

// Using the key provided by the user
const apiKey = "AIzaSyB_15hy7RdGevPtOGbJsUMVJcNZI9noPB8";

const ai = new GoogleGenAI({ apiKey });

async function test() {
  try {
    console.log("Testing Gemini API connection...");
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Reply with 'OK' if you receive this.",
    });
    console.log("Response received:", response.text());
    console.log("SUCCESS: API Key is valid and working.");
  } catch (error) {
    console.error("ERROR: API call failed.");
    console.error(error);
  }
}

test();
