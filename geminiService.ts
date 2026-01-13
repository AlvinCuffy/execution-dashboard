
import { GoogleGenAI, Type } from "@google/genai";
import { BrandData } from "./types";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const extractDNA = async (rawText: string): Promise<Partial<BrandData>> => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Extract business identity details from this raw data dump. 
      If colors aren't mentioned, suggest a high-ticket professional palette. 
      If the year isn't mentioned, default to 2024.
      Return ONLY a JSON object matching this structure:
      {
        "businessName": string,
        "colors": { "primary": hex, "secondary": hex, "accent": hex },
        "yearEstablished": number,
        "tagline": string,
        "overview": string
      }
      
      Raw Data: ${rawText}`,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Error extracting DNA:", error);
    return {};
  }
};

export const generateStrategyThemes = async (overview: string): Promise<string[]> => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this business overview and generate exactly 4 high-level strategic marketing themes for a 30-day plan. Return only the names of the 4 themes. Overview: ${overview}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        },
      },
    });

    if (!response.text) return ["Sustainability", "Process", "Team", "Results"];
    const themes = JSON.parse(response.text.trim());
    return Array.isArray(themes) ? themes.slice(0, 4) : ["Sustainability", "Process", "Team", "Results"];
  } catch (error) {
    return ["Market Penetration", "Brand Authority", "Operational Efficiency", "Client Retention"];
  }
};
