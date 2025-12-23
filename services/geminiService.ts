
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
    // We create a specific prompt for the image generation to ensure the style is consistent
    const imagePrompt = `A surreal, mystical tarot card style illustration representing the following dream concept: "${dreamText.substring(0, 300)}". 
    The style should be ethereal, detailed, cinematic lighting, digital art, dark fantasy aesthetic, intricate details, high quality. 
    Do not include text in the image.`;

    const response = await ai.models.generateContent({
      model: IMAGE_MODEL_NAME,
      contents: {
        parts: [
          { text: imagePrompt }
        ]
      }
    });

    // Extract the base64 image data
    // Assuming the model returns the image in the first candidate's first part
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64String = part.inlineData.data;
        return `data:image/png;base64,${base64String}`;
      }
    }
    
    throw new Error("No image data returned from the API.");

  } catch (error) {
    console.error("Gemini Image API Error:", error);
    // We don't want to crash the whole app if image generation fails, 
    // but we should propagate the error to handle the UI state.
    throw error;
  }
};
