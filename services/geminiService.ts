
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
    // Sanitize and keep it very short
    const safeDreamText = dreamText.replace(/["\n\r]/g, " ").substring(0, 100);

    // Ultra-simple prompt for Flash Image model
    const imagePrompt = `Illustration of: ${safeDreamText}. 
    Style: Surrealist oil painting, dark, mysterious. 
    Ratio: 1:1. High quality.`;

    console.log("Requesting image with prompt:", imagePrompt);

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

    // Check for inlineData (Base64 image)
    if (response.candidates && response.candidates.length > 0 && response.candidates[0].content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          console.log("Image received successfully.");
          const base64String = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || 'image/png';
          return `data:${mimeType};base64,${base64String}`;
        }
      }
    }
    
    // Check if it returned text instead (refusal)
    const textPart = response.candidates?.[0]?.content?.parts?.find(p => p.text);
    if (textPart) {
        console.warn("Model returned text instead of image:", textPart.text);
        throw new Error("Model görsel yerine metin yanıtı döndürdü.");
    }

    throw new Error("Görsel verisi alınamadı.");

  } catch (error) {
    console.error("Gemini Image API Error:", error);
    throw error;
  }
};
