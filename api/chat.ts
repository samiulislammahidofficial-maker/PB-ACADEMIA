import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.includes("YOUR_")) {
      return res.status(400).json({ error: "Invalid API Key detected. Please configure a valid Gemini API key in your hosting provider's environment variables as GEMINI_API_KEY." });
    }
    
    const ai = new GoogleGenAI({ apiKey });
    const { message } = req.body || {};
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: "You are a helpful, knowledgeable AI assistant for an educational platform called QuizBlust. Be concise, friendly, and helpful to the students and teachers using the platform. Your name is 'Porar Bojha'."
      }
    });

    const responseStream = await chat.sendMessageStream({ message });
    
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const chunk of responseStream) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
      }
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (e: any) {
    console.error("Chat API Error:", e);
    const msg = e.message || "Internal server error";
    if (!res.headersSent) {
      res.status(500).json({ error: msg });
    } else {
      res.end();
    }
  }
}
