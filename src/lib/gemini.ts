import { GoogleGenAI } from '@google/genai';

export async function generateContent(options: { model?: string, contents: any, config?: { responseMimeType?: string, responseSchema?: any } }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing Gemini API Key. Please configure GEMINI_API_KEY in your deployment environment.');
  }
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const fetchPromise = ai.models.generateContent({
      model: options.model || 'gemini-2.5-flash',
      contents: options.contents,
      config: options.config,
    });
    
    // Add a 15-second timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timed out. The AI is taking too long to respond. Please try again.')), 15000)
    );
    
    const response = await Promise.race([fetchPromise, timeoutPromise]) as any;
    
    return { text: response.text };
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('quota') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
      throw new Error('Gemini API quota exceeded. Please wait a minute and try again, or check your API key billing details.');
    }
    throw new Error(error?.message || 'Failed to communicate with AI service.');
  }
}

