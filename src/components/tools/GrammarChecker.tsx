import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Sparkles, AlertTriangle, Save, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateContent } from '../../lib/gemini';

export default function GrammarChecker() {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ original: string, corrected: string, errors: { original: string, fixed: string, reason: string }[], errorCount: number } | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const checkGrammar = async () => {

    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const prompt = `You are an expert English grammar checker.
      Analyze the following text for grammatical, punctuation, and spelling errors.
      Provide the corrected text and a list of specific errors found.
      
      Output JSON exact format:
      {
        "original": "The original text exactly",
        "corrected": "The fully corrected text",
        "errorCount": 3,
        "errors": [
          { "original": "wrong word", "fixed": "right word", "reason": "Explanation" }
        ]
      }
      
      Text to check:
      "${text}"`;

      const response = await generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
           responseMimeType: 'application/json',
        }
      });
      const data = JSON.parse(response.text?.trim() || '{}');
      setResult(data);
    } catch (e: any) {
      console.error(e);
      alert('Error fetching AI data: ' + (e?.message || e));
    } finally {
      setLoading(false);
    }
  };

  const applyFix = () => {
    if (result && result.corrected) {
       setText(result.corrected);
       setResult(null);
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
            <h1 className="text-3xl font-black uppercase tracking-widest text-brand-primary mb-2 flex items-center">
              <CheckCircle2 className="mr-3" /> Grammar Fixer
            </h1>
            <p className="text-neutral-400 text-sm">Paste your paragraph below. We'll find mistakes and fix them beautifully.</p>
          </div>
          <button 
            onClick={() => setShowPremiumModal(true)}
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center transition-colors"
          >
            <Save size={14} className="mr-2 text-brand-primary" /> Save
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-4">
            <textarea
              className="w-full h-80 bg-brand-dark/50 border border-white/10 rounded-xl p-4 text-white resize-none outline-none focus:border-brand-primary transition-colors"
              placeholder="Paste or type your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex items-center space-x-4">
               <button 
                 onClick={checkGrammar}
                 disabled={loading || !text}
                 className="flex-1 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-4 rounded-xl uppercase tracking-widest text-sm disabled:opacity-50 transition-colors"
               >
                 {loading ? 'Checking...' : 'Check Errors'}
               </button>
               {result && (
                  <button 
                    onClick={applyFix}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl uppercase tracking-widest text-sm transition-colors flex items-center justify-center"
                  >
                    <Sparkles size={16} className="mr-2"/> Fix All 100%
                  </button>
               )}
            </div>
          </div>

          <div className="bg-brand-dark/30 border border-white/5 rounded-xl p-6 h-fit max-h-[500px] overflow-y-auto">
             <h3 className="text-xs font-black uppercase tracking-widest text-neutral-500 mb-4 flex items-center border-b border-white/5 pb-2">
               Analysis Results
             </h3>
             
             {!result && !loading && (
               <div className="text-neutral-500 text-sm text-center py-10 opacity-50 flex flex-col items-center">
                 <AlertTriangle size={32} className="mb-2"/>
                 Awaiting your text.
               </div>
             )}

             {loading && (
               <div className="text-brand-primary text-sm text-center py-10 animate-pulse">
                 Scanning text for errors...
               </div>
             )}

             {result && (
               <div>
                  <div className="bg-rose-500/10 text-rose-500 text-center py-3 rounded-lg mb-4 font-bold text-lg">
                     {result.errorCount} Mistakes Found
                  </div>
                  <div className="space-y-4">
                     {result.errors?.map((err, i) => (
                       <div key={i} className="bg-white/5 p-3 rounded-lg border border-white/10">
                          <div className="flex items-center justify-between mb-2">
                             <span className="text-rose-400 line-through text-sm">{err.original}</span>
                             <ArrowLeft size={12} className="text-neutral-500" />
                             <span className="text-emerald-400 font-bold text-sm">{err.fixed}</span>
                          </div>
                          <div className="text-[10px] text-neutral-400 uppercase tracking-widest bg-black/20 p-2 rounded">
                            {err.reason}
                          </div>
                       </div>
                     ))}
                     {result.errorCount === 0 && (
                        <div className="text-emerald-400 text-center py-6 font-bold flex flex-col items-center">
                           <Sparkles size={24} className="mb-2" />
                           Your grammar is perfect!
                        </div>
                     )}
                  </div>
               </div>
             )}
          </div>
        </div>
      </div>

      {showPremiumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 p-8 rounded-3xl max-w-sm w-full text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary via-blue-500 to-purple-500"></div>
            <div className="w-16 h-16 bg-brand-primary/20 text-brand-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock size={32} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight mb-3">Premium Feature</h3>
            <p className="text-neutral-400 text-sm mb-8 leading-relaxed">Saving your grammar checks and history requires an active course purchase. Buy any course to unlock history for all tools!</p>
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
