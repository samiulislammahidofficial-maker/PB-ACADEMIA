import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

let ai: GoogleGenAI | null = null;
let initError: string | null = null;
try {
  console.log("Initializing Gemini with key length: ", process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0);
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
} catch (error: any) {
  console.error("Failed to initialize GoogleGenAI", error);
  initError = error?.message || String(error);
}

type Message = {
  id: string;
  role: 'user' | 'model';
  text: string;
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: 'Hello! I am your AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<Chat | null>(null);

  useEffect(() => {
    if (ai && !chatRef.current) {
      chatRef.current = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: "You are a helpful, knowledgeable AI assistant for an educational platform called QuizBlust. Be concise, friendly, and helpful to the students and teachers using the platform."
        }
      });
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !ai || !chatRef.current) return;
    
    const userMessage: Message = { id: Date.now().toString(), role: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Initialize bot message
    const botMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: botMessageId, role: 'model', text: '' }]);

    try {
      const streamResponse = await chatRef.current.sendMessageStream({ message: userMessage.text });
      
      for await (const chunk of streamResponse) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          setMessages(prev => prev.map(msg => 
            msg.id === botMessageId 
              ? { ...msg, text: msg.text + c.text } 
              : msg
          ));
        }
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'model', 
        text: `Error: ${error.message || String(error)}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-500 transition-all z-50 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-80 sm:w-96 md:w-[26rem] h-[32rem] bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm">QuizBlust AI</h3>
                  <p className="text-neutral-500 text-xs">Powered by Gemini</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-white/5 transition-colors text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                      message.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-br-sm' 
                        : 'bg-white/5 text-neutral-100 border border-white/10 rounded-bl-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3">
                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-black/40">
              {!ai ? (
                 <div className="text-xs text-red-400 text-center px-4 py-2 bg-red-400/10 rounded-lg flex-1">
                 {initError ? `Init error: ${initError}` : 'API key is missing or invalid. Set GEMINI_API_KEY environment variable.'}
               </div>
              ) : (
                <form 
                  onSubmit={handleSend}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="p-2.5 rounded-full bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
