
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
    // Prompt explicitly asking for an image generation
    const imagePrompt = `Generate a high-quality, surreal, psychological dreamscape illustration representing this dream concept: "${dreamText.substring(0, 300)}".
    
    Style requirements:
    - Artistic Style: Mix of Salvador Dali and Rene Magritte.
    - Atmosphere: Ethereal, mysterious, deep subconscious, moody cinematic lighting.
    - Composition: Abstract but recognizable symbols, oil painting texture.
    - NO TEXT, NO LETTERS, NO WORDS in the image.`;

    // Gemini Flash Image uses generateContent, not generateImages
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL_NAME,
      contents: {
        parts: [
          { text: imagePrompt }
        ]
      },
      // config: { responseMimeType: 'image/jpeg' } // Not supported/needed for Flash Image
    });

    // Extract the base64 image data from the response parts
    // The model might return text and image, we need to find the image part.
    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content?.parts || [];
      for (const part of parts) {
        if (part.inlineData) {
          const base64String = part.inlineData.data;
          // Gemini Flash Image typically returns PNG or JPEG
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${base64String}`;
        }
      }
    }
    
    throw new Error("API yanıt verdi fakat görsel verisi bulunamadı.");

  } catch (error) {
    console.error("Gemini Image API Error:", error);
    throw error;
  }
};
