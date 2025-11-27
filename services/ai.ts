import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getBehavioralInsight = async (context: string, type: 'HABIT' | 'JOURNAL' | 'ORDER'): Promise<string> => {
  let prompt = "";
  
  if (type === 'HABIT') {
    prompt = `Act as a behavioral scientist. The user is struggling with this context: "${context}". Provide one specific, micro-behavioral adjustment to increase success probability. Keep it under 20 words.`;
  } else if (type === 'JOURNAL') {
    prompt = `Act as a stoic philosopher and psychologist. Read this journal entry: "${context}". Provide one hard truth or reframing perspective to build mental clarity. Max 2 sentences.`;
  } else if (type === 'ORDER') {
    prompt = `The user needs to declutter or organize their life. Context/Room: "${context}". Give a strictly 10-minute specific micro-task to restore order. Imperative mood.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("AI Error", error);
    return "Focus on the present moment.";
  }
};

export const generateIdentityQuestions = async (): Promise<string[]> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: "Generate 3 profound, Jordan Peterson-style self-authoring questions for someone building their long-term identity. Return as JSON array of strings.",
            config: {
                responseMimeType: "application/json"
            }
        });
        const text = response.text;
        return JSON.parse(text) as string[];
    } catch (e) {
        return ["Who do you want to be in 5 years?", "What habits are destroying you?", "Define your ultimate responsibility."];
    }
}