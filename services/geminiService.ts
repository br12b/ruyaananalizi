
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION, TEXT_MODEL_NAME, IMAGE_MODEL_NAME } from "../constants";

// Initialize the API client
// @ts-ignore: process.env.API_KEY is replaced by Vite at build time
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeDreamStream = async (
  dreamText: string,
  onChunk: (text: string) => void
): Promise<void> => {
  try {
    const responseStream = await ai.models.generateContentStream({
      model: TEXT_MODEL_NAME,
      contents: [
        {
          role: 'user',
          parts: [{ text: dreamText }]
        }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        onChunk(text);
      }
    }
  } catch (error) {
    console.error("Gemini Text API Error:", error);
    throw error;
  }
};

export const generateDreamImage = async (dreamText: string): Promise<string> => {
  try {
    // Updated prompt: Removed "tarot card" reference.
    // Switched to surreal, psychological dreamscape style.
    const imagePrompt = `A surreal, deep psychological dreamscape illustration representing: "${dreamText.substring(0, 300)}". 
    Style: Salvador Dali meets Rene Magritte. Ethereal, cinematic lighting, digital art, subconscious symbolism, mysterious, detailed background, masterpiece. 
    NO text, NO borders, NO card frames.`;

    const response = await ai.models.generateContent({
      model: IMAGE_MODEL_NAME,
      contents: {
        parts: [
          { text: imagePrompt }
        ]
      }
    });

    // Extract the base64 image data
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64String = part.inlineData.data;
        return `data:image/png;base64,${base64String}`;
      }
    }
    
    throw new Error("No image data returned from the API.");

  } catch (error) {
    console.error("Gemini Image API Error:", error);
    throw error;
  }
};
