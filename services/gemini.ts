import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from '../constants';
import { Board, Language } from '../types';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

export const generateEduContent = async (
  prompt: string, 
  board: Board, 
  language: Language,
  toolName?: string
): Promise<string> => {
  try {
    // Construct a context-aware prompt
    const contextPrompt = `
      User Settings:
      BOARD: ${board}
      LANGUAGE: ${language}
      ${toolName ? `SELECTED TOOL: ${toolName}` : ''}
      
      User Request: ${prompt}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contextPrompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
      }
    });

    return response.text || "Sorry, I couldn't generate content at this moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating content. Please check your connection or API key.";
  }
};
