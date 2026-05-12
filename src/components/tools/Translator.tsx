import React, { useState } from 'react';
import { ArrowLeft, Languages, Volume2, ArrowRightLeft, Save, Sparkles, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateContent } from '../../lib/gemini';

export default function Translator() {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [direction, setDirection] = useState<'EN_TO_BN' | 'BN_TO_EN'>('EN_TO_BN');
  const [loading, setLoading] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const handleTranslate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const prompt = direction === 'EN_TO_BN' 
        ? `Translate the following English text to perfectly natural Bengali. Output ONLY the Bengali translation.\n\nText: "${text}"`
        : `Translate the following Bengali text to perfectly natural English. Output ONLY the English translation.\n\nText: "${text}"`;

      const response = await generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      setTranslatedText(response.text?.trim() || '');
    } catch (e: any) {
      console.error(e);
      alert('Error fetching translation: ' + (e?.message || e));
    } finally {
      setLoading(false);
    }
  };

  const speak = (textToSpeak: string, lang: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in your browser.");
    }
  };

  const toggleDirection = () => {
    setDirection(prev => prev === 'EN_TO_BN' ? 'BN_TO_EN' : 'EN_TO_BN');
    setTranslatedText('');
    setText('');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate('/')} className="text-neutral-400 hover:text-white flex items-center mb-8 uppercase tracking-widest text-[10px] font-black">
          <ArrowLeft size={16} className="mr-2" /> Back
        </button>

        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-widest text-blue-500 mb-2 flex items-center">
              <Languages className="mr-3" size={36} /> Smart Translator
            </h1>
            <p className="text-neutral-400 text-sm">Perfect translation between English and Bengali with pronunciation.</p>
          </div>
          <button 
            onClick={() => setShowPremiumModal(true)}
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center transition-colors"
          >
            <Save size={14} className="mr-2 text-blue-400" /> Save Chat
          </button>
        </div>

        <div className="bg-brand-dark/50 rounded-3xl border border-white/10 shadow-2xl overflow-hidden shadow-blue-500/5">
          {/* Controls */}
          <div className="bg-black/40 border-b border-white/10 p-4 flex items-center justify-center relative">
            <div className="flex items-center space-x-6">
              <div className={`text-sm font-black uppercase tracking-widest ${direction === 'EN_TO_BN' ? 'text-blue-400' : 'text-neutral-500'}`}>
                English
              </div>
              <button 
                onClick={toggleDirection}
                className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-white transition-all active:scale-95 border border-white/10"
              >
                <ArrowRightLeft size={16} />
              </button>
              <div className={`text-sm font-black uppercase tracking-widest ${direction === 'BN_TO_EN' ? 'text-blue-400' : 'text-neutral-500'}`}>
                Bengali
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {/* Input */}
            <div className="p-6 flex flex-col h-[400px]">
              <textarea
                className="flex-1 bg-transparent border-none resize-none outline-none text-lg text-white placeholder:text-neutral-600 leading-relaxed max-w-full"
                placeholder={direction === 'EN_TO_BN' ? "Type english text here..." : "এখানে বাংলায় লিখুন..."}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="mt-4 flex justify-between items-center border-t border-white/5 pt-4">
                <button 
                  onClick={() => speak(text, direction === 'EN_TO_BN' ? 'en-US' : 'bn-BD')}
                  disabled={!text}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-blue-400 transition-colors disabled:opacity-30"
                  title="Listen"
                >
                  <Volume2 size={18} />
                </button>
                <button
                  onClick={handleTranslate}
                  disabled={loading || !text}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-xl uppercase tracking-widest text-xs disabled:opacity-50 transition-colors flex items-center"
                >
                  {loading ? 'Translating...' : 'Translate'} <Sparkles size={14} className="ml-2" />
                </button>
              </div>
            </div>

            {/* Output */}
            <div className="p-6 flex flex-col h-[400px] bg-blue-950/10">
              <div className="flex-1 overflow-y-auto text-lg text-blue-50 leading-relaxed font-medium">
                {loading ? (
                  <div className="text-blue-500/50 animate-pulse flex items-center h-full justify-center space-x-2">
                    <Sparkles size={20} /> <span>Translating...</span>
                  </div>
                ) : translatedText ? (
                  <p>{translatedText}</p>
                ) : (
                  <div className="text-neutral-600 italic flex items-center h-full justify-center">Translation will appear here.</div>
                )}
              </div>
              <div className="mt-4 flex justify-between items-center border-t border-white/5 pt-4">
                <button 
                  onClick={() => speak(translatedText, direction === 'EN_TO_BN' ? 'bn-BD' : 'en-US')}
                  disabled={!translatedText}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-blue-400 transition-colors disabled:opacity-30"
                  title="Listen"
                >
                  <Volume2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPremiumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 p-8 rounded-3xl max-w-sm w-full text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock size={32} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight mb-3">Premium Feature</h3>
            <p className="text-neutral-400 text-sm mb-8 leading-relaxed">Saving your translations and chat history requires an active course purchase. Buy any course to unlock history for all tools!</p>
            <div className="space-y-3">
              <button onClick={() => navigate('/courses')} className="w-full bg-white text-black hover:bg-neutral-200 font-bold py-3 px-6 rounded-xl uppercase tracking-widest text-xs transition-colors">
                View Courses
              </button>
              <button onClick={() => setShowPremiumModal(false)} className="w-full bg-transparent hover:bg-white/5 text-white font-bold py-3 px-6 rounded-xl uppercase tracking-widest text-xs transition-colors">
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
