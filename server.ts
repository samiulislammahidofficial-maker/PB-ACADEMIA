import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      key: process.env.GEMINI_API_KEY
    });
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.includes("YOUR_")) {
        return res.status(400).json({ error: "Invalid API Key detected. It appears you have saved the placeholder 'MY_GEMINI_API_KEY' in your AI Studio Secrets panel. Please go to Settings -> Secrets and replace it with a valid Gemini API key, or delete it to use the default environment key." });
      }
      
      const ai = new GoogleGenAI({ apiKey });
      const { message } = req.body;
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
      if (!res.headersSent) {
        res.status(500).json({ error: e.message || "Internal server error" });
      } else {
        res.end();
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
