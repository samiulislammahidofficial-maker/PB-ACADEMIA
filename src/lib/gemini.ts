import { GoogleGenAI } from '@google/genai';

export async function generateContent(options: { model?: string, contents: any, config?: { responseMimeType?: string, responseSchema?: any } }) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : undefined);
  if (!apiKey) {
    throw new Error('Missing Gemini API Key. Please configure VITE_GEMINI_API_KEY in your deployment.');
  }
  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: options.model || 'gemini-2.5-flash',
    contents: options.contents,
    config: options.config,
  });
  
  return { text: response.text };
}

