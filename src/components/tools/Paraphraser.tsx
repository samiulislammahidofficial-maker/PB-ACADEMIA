import React, { useState } from 'react';
import { ArrowLeft, Wand2, CheckCircle2, ChevronRight, Hash, Save, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI } from '@google/genai';

export default function Paraphraser() {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [tone, setTone] = useState('Professional');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ paraphrased: string, original: string } | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  
  const tones = ['Professional', 'Friendly', 'Academic', 'Creative', 'Concise', 'Elaborate'];

  const handleParaphrase = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Paraphrase the following text in a "${tone}" tone. Make it sound natural and well-written. Output ONLY the paraphrased text, nothing else.
      
Text:
"${text}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt
      });
      setResult({ original: text, paraphrased: response.text?.trim() || '' });
    } catch (e) {
      console.error(e);
      alert('Error fetching AI data.');
    } finally {
      setLoading(false);
    }
  };

  const rephraseAgain = async () => {
     if (result) {
        setText(result.paraphrased);
        handleParaphrase();
     }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/')} className="text-neutral-400 hover:text-white flex items-center mb-8 uppercase tracking-widest text-[10px] font-black">
          <ArrowLeft size={16} className="mr-2" /> Back
        </button>

        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-widest text-emerald-500 mb-2 flex items-center">
              <Wand2 className="mr-3" /> Paraphraser
            </h1>
            <p className="text-neutral-400 text-sm">Rewrite your text in different styles to make it sound perfect.</p>
          </div>
          <button 
            onClick={() => setShowPremiumModal(true)}
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center transition-colors"
          >
            <Save size={14} className="mr-2 text-emerald-400" /> Save
          </button>
        </div>

        <div className="bg-brand-dark/50 p-6 rounded-2xl border border-white/10 shadow-2xl relative">
          
          <div className="flex flex-wrap gap-2 mb-6">
             {tones.map(t => (
               <button
                 key={t}
                 onClick={() => setTone(t)}
                 className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors
                   ${tone === t ? 'bg-emerald-500 text-white' : 'bg-white/5 text-neutral-400 hover:bg-white/10'}`}
               >
                 {t}
               </button>
             ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            
            <div className="flex flex-col space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 pl-1">Original Text</label>
              <textarea
                className="w-full h-64 bg-black/40 border border-white/5 rounded-xl p-4 text-white resize-none outline-none focus:border-emerald-500/50 transition-colors"
                placeholder="What do you want to rewrite?"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-emerald-500 rounded-full items-center justify-center border-4 border-brand-dark z-10 shadow-lg text-white">
              <ChevronRight size={20} />
            </div>

            <div className="flex flex-col space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 pl-1">Paraphrased</label>
              <div
                className={`w-full h-64 bg-emerald-900/10 border ${result ? 'border-emerald-500/30' : 'border-white/5'} rounded-xl p-4 text-white relative transition-colors overflow-y-auto`}
              >
                {loading ? (
                   <div className="flex items-center justify-center h-full text-emerald-500/50 space-x-2 animate-pulse">
                     <Wand2 size={24} /> <span>Rewriting...</span>
                   </div>
                ) : result ? (
                   <p className="text-emerald-50 font-medium leading-relaxed">{result.paraphrased}</p>
                ) : (
                   <div className="flex items-center justify-center h-full text-neutral-600 italic text-sm">
                     The improved text will appear here.
                   </div>
                )}
              </div>
            </div>

          </div>

          <div className="mt-6 flex justify-between items-center border-t border-white/5 pt-6">
            <div className="text-xs text-neutral-500 uppercase tracking-widest font-bold">
              Tone: <span className="text-emerald-500">{tone}</span>
            </div>
            <div className="flex space-x-3">
              {result && (
                <button
                  onClick={rephraseAgain}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-xl uppercase tracking-widest text-xs transition-colors flex items-center"
                >
                  <Hash size={14} className="mr-2"/> Re-phrase again
                </button>
              )}
              <button
                onClick={handleParaphrase}
                disabled={loading || !text}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-xl uppercase tracking-widest text-xs disabled:opacity-50 transition-colors flex items-center"
              >
                <Wand2 size={14} className="mr-2"/> {result ? 'Refine' : 'Paraphrase'}
              </button>
            </div>
          </div>

        </div>

      </div>

      {showPremiumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 p-8 rounded-3xl max-w-sm w-full text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500"></div>
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock size={32} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight mb-3">Premium Feature</h3>
            <p className="text-neutral-400 text-sm mb-8 leading-relaxed">Saving your rewritten texts and history requires an active course purchase. Buy any course to unlock history for all tools!</p>
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
