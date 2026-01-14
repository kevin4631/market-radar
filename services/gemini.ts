import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateReportAnalysis = async (title: string, description: string) => {
  try {
    const prompt = `
      Analyze the following market report metadata and provide a short, professional "Executive Summary" (max 20 words) and a Sentiment Score (0-100) with a Label (Bearish, Neutral, Bullish).
      
      Report Title: ${title}
      Report Description: ${description}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A punchy, professional 20-word summary."
            },
            score: {
              type: Type.NUMBER,
              description: "Sentiment score from 0 to 100."
            },
            label: {
              type: Type.STRING,
              enum: ["Bearish", "Neutral", "Bullish"]
            }
          },
          required: ["summary", "score", "label"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    // Fallback if AI fails or key is missing
    return {
      summary: "AI Analysis unavailable. Market conditions remain volatile.",
      score: 50,
      label: "Neutral"
    };
  }
};