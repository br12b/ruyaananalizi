
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
    // Sanitize and shorten the dream text to avoid confusing the model or hitting token limits for image gen
    // We take the first 150 chars to keep the prompt focused on the main theme
    const safeDreamText = dreamText.replace(/["\n\r]/g, " ").substring(0, 150);

    // Prompt engineered to be an imperative command for image generation
    // Stronger "Create an image" instruction helps prevent text-only responses
    const imagePrompt = `Create an image. 
    Subject: A surreal dream scene depicting: ${safeDreamText}. 
    Art Style: Salvador Dali meets Rene Magritte. Atmospheric, mysterious, dreamlike quality, oil painting texture.
    Requirements: No text, no words, high resolution, 1:1 aspect ratio.`;

    const response = await ai.models.generateContent({
      model: IMAGE_MODEL_NAME,
      contents: [
        {
           parts: [{ text: imagePrompt }]
        }
      ],
      config: {
        // Explicitly requesting image generation configuration
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });

    // Extract the base64 image data
    // Iterate through all parts as the image might not be the first part
    if (response.candidates && response.candidates.length > 0 && response.candidates[0].content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64String = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || 'image/png';
          return `data:${mimeType};base64,${base64String}`;
        }
      }
    }
    
    // Log warning if no image data found to help debugging
    console.warn("Gemini Image Gen: No inlineData found. Full response:", response);
    throw new Error("Görsel oluşturulamadı (Model metin yanıtı döndü).");

  } catch (error) {
    console.error("Gemini Image API Error:", error);
    throw error;
  }
};
