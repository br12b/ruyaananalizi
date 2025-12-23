
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
    // Prompt optimized for Imagen 3
    const imagePrompt = `Abstract surrealist art, dream interpretation, psychological symbolism. 
    Subject: "${dreamText.substring(0, 300)}".
    Style: Ethereal, moody lighting, Salvador Dali style, Rene Magritte style, oil painting texture, deep subconscious atmosphere.
    High quality, 8k resolution, cinematic composition. No text, no words.`;

    // Use generateImages for Imagen models
    const response = await ai.models.generateImages({
      model: IMAGE_MODEL_NAME,
      prompt: imagePrompt,
      config: {
        numberOfImages: 1,
        aspectRatio: '1:1',
        outputMimeType: 'image/jpeg'
      }
    });

    // Correctly extract image bytes from the generateImages response
    if (response.generatedImages && response.generatedImages.length > 0) {
       const base64String = response.generatedImages[0].image.imageBytes;
       return `data:image/jpeg;base64,${base64String}`;
    }
    
    throw new Error("Görsel oluşturulamadı (Veri alınamadı).");

  } catch (error) {
    console.error("Imagen API Error:", error);
    throw error;
  }
};
