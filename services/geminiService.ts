
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
    // Simplified prompt specifically for Flash Image model
    // The model responds better to direct "Draw" commands than complex descriptions
    const imagePrompt = `Draw a surreal, artistic interpretation of this dream: "${dreamText.substring(0, 150)}". 
    Style: Salvador Dali, oil painting, mysterious, cinematic lighting, dark fantasy. 
    NO TEXT. High quality.`;

    const response = await ai.models.generateContent({
      model: IMAGE_MODEL_NAME,
      contents: {
        parts: [
          { text: imagePrompt }
        ]
      },
      config: {
        // CRITICAL: This config forces the model to generate an image
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });

    // Extract the base64 image data
    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content?.parts || [];
      for (const part of parts) {
        if (part.inlineData) {
          const base64String = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || 'image/png';
          return `data:${mimeType};base64,${base64String}`;
        }
      }
    }
    
    // If no image part found, log the text part to understand why
    console.warn("Model returned only text:", response.text);
    throw new Error("Görsel oluşturulamadı (Model metin yanıtı döndü).");

  } catch (error) {
    console.error("Gemini Image API Error:", error);
    throw error;
  }
};
