import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Trophy, ArrowRight, CheckCircle2, XCircle, HelpCircle, Sparkles } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "যদি একটি ইলেকট্রিক ট্রেন উত্তর দিকে যায় এবং বাতাস দক্ষিণ দিকে বয়, তবে ট্রেনের ধোঁয়া কোন দিকে যাবে?",
    options: ["উত্তর দিকে", "দক্ষিণ দিকে", "একটুও ধোঁয়া বের হবে না", "পূর্ব দিকে"],
    correct: 2,
    explanation: "ইলেকট্রিক ট্রেন থেকে ধোঁয়া বের হয় না!"
  },
  {
    id: 2,
    question: "একটি ঝুড়িতে ৫টি আপেল আছে। আপনি ৩টি নিয়ে নিলেন। এখন আপনার কাছে কয়টি আপেল আছে?",
    options: ["২টি", "৩টি", "৫টি", "০টি"],
    correct: 1,
    explanation: "আপনি ৩টি আপেল নিয়েছেন, তাই আপনার কাছে ৩টিই আছে।"
  },
  {
    id: 3,
    question: "কোন মাস ২৮ দিনে শেষ হয়?",
    options: ["ফেব্রুয়ারি", "জুন", "সব মাস", "আগস্ট"],
    correct: 2,
    explanation: "প্রতিটি মাসেই কমপক্ষে ২৮ দিন থাকে!"
  },
  {
    id: 4,
    question: "এক কেজি লোহা আর এক কেজি তুলার মধ্যে কোনটি বেশি ভারী?",
    options: ["লোহা", "তুলা", "উভয়ই সমান", "বলার উপায় নেই"],
    correct: 2,
    explanation: "উভয়ই এক কেজি, তাই তারা সমান ভারী।"
  }
];

export default function BrainTeasers() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setHasFinished(true);
    }
  };

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowResult(true);
    if (idx === questions[currentIdx].correct) {
      setScore(score + 1);
    }
  };

  const q = questions[currentIdx];

  if (hasFinished) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#0a0a0a] p-12 rounded-[4rem] border border-white/5 shadow-2xl text-center max-w-lg w-full"
        >
          <div className="h-24 w-24 bg-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-600/20">
            <Trophy className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">অভিনন্দন!</h2>
          <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px] mb-10">আপনার ব্রেইন পাওয়ার টেস্ট শেষ হয়েছে</p>
          
          <div className="p-10 bg-white/5 rounded-[3rem] border border-white/5 mb-10">
            <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest mb-2">Final Score</p>
            <p className="text-6xl font-black text-white">{score} <span className="text-2xl text-neutral-700">/ {questions.length}</span></p>
          </div>

          <button 
            onClick={() => window.location.reload()}
            className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-xl shadow-blue-600/20"
          >
            আবার পরীক্ষা দিন
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-blue-600/20">
              <Brain className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Brain <span className="text-blue-500">Teasers</span></h1>
              <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-1 italic">IQ Test & Analytical Puzzles</p>
            </div>
          </div>
          <div className="px-8 py-4 bg-white/5 border border-white/5 rounded-2xl flex items-center space-x-4">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span className="text-xs font-black text-white uppercase tracking-widest">Score: {score}</span>
          </div>
        </div>

        <div className="bg-[#0a0a0a] p-8 md:p-16 rounded-[4rem] border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px]-"></div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-8">
              <span className="px-5 py-2 bg-blue-600/10 text-blue-500 border border-blue-600/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                Question {currentIdx + 1} of {questions.length}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-12">
              {q.question}
            </h2>

            <div className="grid gap-4">
              {q.options.map((option, i) => (
                <button
                  key={i}
                  disabled={selected !== null}
                  onClick={() => handleSelect(i)}
                  className={`w-full p-6 rounded-[2rem] border-2 text-left transition-all flex items-center justify-between group ${
                    selected === i 
                      ? i === q.correct ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'
                      : selected !== null && i === q.correct ? 'border-green-500 bg-green-500/5' : 'border-white/5 bg-black hover:border-white/20'
                  }`}
                >
                  <span className={`font-bold ${selected !== null ? 'text-white' : 'text-neutral-400 group-hover:text-white'}`}>
                    {option}
                  </span>
                  {selected !== null && i === q.correct && <CheckCircle2 className="h-6 w-6 text-green-500" />}
                  {selected === i && i !== q.correct && <XCircle className="h-6 w-6 text-red-500" />}
                </button>
              ))}
            </div>

            <AnimatePresence>
              {showResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-10 p-8 rounded-[2.5rem] border ${
                    selected === q.correct ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <HelpCircle className={`h-6 w-6 mt-1 flex-shrink-0 ${selected === q.correct ? 'text-green-500' : 'text-red-500'}`} />
                    <div>
                      <p className="font-bold text-white text-sm uppercase tracking-tight mb-2">
                        {selected === q.correct ? 'দারুণ! সঠিক উত্তর।' : 'ভুল উত্তর!'}
                      </p>
                      <p className="text-neutral-500 text-sm leading-relaxed">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={handleNext}
                    className="mt-8 w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center space-x-3 hover:scale-105 transition-all"
                  >
                    <span>পরবর্তী প্রশ্ন</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
