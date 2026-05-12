import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Clock, PlayCircle, Hash, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI, Type } from '@google/genai';

interface VocabWord {
  word: string;
  definition: string;
  example: string;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

export default function VocabBuilder() {
  const navigate = useNavigate();
  const [wordCount, setWordCount] = useState(5);
  const [phase, setPhase] = useState<'setup' | 'learn' | 'quiz' | 'result'>('setup');
  const [loading, setLoading] = useState(false);
  
  const [words, setWords] = useState<VocabWord[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [mistakes, setMistakes] = useState<{q: string, answered: string, correct: string}[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (phase === 'quiz' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    } else if (phase === 'quiz' && timeLeft === 0) {
      setPhase('result');
    }
    return () => clearTimeout(timer);
  }, [phase, timeLeft]);

  const generateVocab = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Generate ${wordCount} advanced English vocabulary words for learning. Include definition and an example sentence for each. They should be distinct from common words. Output as JSON.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                definition: { type: Type.STRING },
                example: { type: Type.STRING },
              },
              required: ['word', 'definition', 'example']
            }
          }
        }
      });
      const data = JSON.parse(response.text?.trim() || '[]');
      setWords(data);
      setPhase('learn');
      setCurrentWordIndex(0);
    } catch (e) {
      console.error(e);
      alert('Failed to generate words.');
    } finally {
      setLoading(false);
    }
  };

  const generateQuiz = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const wordList = words.map(w => w.word).join(', ');
      const prompt = `Create a multiple choice quiz testing the knowledge of these words: ${wordList}. 
      Create 1 question per word. Give 4 options, only 1 is correct. Output as JSON.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.STRING },
              },
              required: ['question', 'options', 'correctAnswer']
            }
          }
        }
      });
      const data = JSON.parse(response.text?.trim() || '[]');
      setQuestions(data);
      setQuizIndex(0);
      setScore(0);
      setMistakes([]);
      setTimeLeft(wordCount * 15); // 15 seconds per word
      setPhase('quiz');
    } catch (e) {
      console.error(e);
      alert('Failed to generate quiz.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (option: string) => {
    const q = questions[quizIndex];
    if (option === q.correctAnswer) {
      setScore(s => s + 1);
    } else {
      setMistakes(m => [...m, { q: q.question, answered: option, correct: q.correctAnswer }]);
    }

    if (quizIndex + 1 < questions.length) {
      setQuizIndex(i => i + 1);
    } else {
      setPhase('result');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate('/')} className="text-neutral-400 hover:text-white flex items-center mb-8 uppercase tracking-widest text-[10px] font-black">
          <ArrowLeft size={16} className="mr-2" /> Back
        </button>

        <h1 className="text-3xl font-black uppercase tracking-widest text-indigo-500 mb-2 flex items-center">
          <BookOpen className="mr-3" /> Vocabulary Builder
        </h1>
        <p className="text-neutral-400 mb-8 text-sm">Learn new words and take a timed challenge to test your memory.</p>

        <div className="bg-brand-dark/50 p-8 rounded-3xl border border-white/10 shadow-2xl">
          
          {phase === 'setup' && (
             <div className="flex flex-col items-center py-12">
               <Hash size={48} className="text-indigo-500/50 mb-6" />
               <h2 className="text-xl font-bold mb-8">How many words do you want to learn today?</h2>
               <div className="flex space-x-4 mb-12">
                 {[5, 10, 15, 20].map(n => (
                   <button
                     key={n}
                     onClick={() => setWordCount(n)}
                     className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black transition-all ${
                       wordCount === n ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.5)] scale-110' : 'bg-white/5 text-neutral-400 hover:bg-white/10'
                     }`}
                   >
                     {n}
                   </button>
                 ))}
               </div>
               
               <button
                 onClick={generateVocab}
                 disabled={loading}
                 className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-12 rounded-xl uppercase tracking-widest text-sm disabled:opacity-50 transition-colors flex items-center"
               >
                 {loading ? 'Curating Words...' : 'Start Learning'} <PlayCircle size={18} className="ml-3" />
               </button>
             </div>
          )}

          {phase === 'learn' && words.length > 0 && (
             <div className="py-6">
               <div className="text-xs uppercase font-black tracking-[0.2em] text-neutral-500 mb-8 flex justify-between">
                 <span>Word {currentWordIndex + 1} of {words.length}</span>
               </div>
               
               <div className="min-h-[250px] flex flex-col justify-center items-center text-center px-4 mb-12">
                 <h2 className="text-5xl font-black text-indigo-400 mb-6 drop-shadow-lg capitalize">{words[currentWordIndex].word}</h2>
                 <p className="text-xl text-neutral-200 mb-6 leading-relaxed">"{words[currentWordIndex].definition}"</p>
                 <div className="bg-indigo-900/20 py-4 px-6 rounded-xl border border-indigo-500/30 max-w-lg italic text-neutral-400">
                   {words[currentWordIndex].example}
                 </div>
               </div>

               <div className="flex justify-between items-center border-t border-white/5 pt-6">
                 <button
                   onClick={() => setCurrentWordIndex(i => Math.max(0, i - 1))}
                   disabled={currentWordIndex === 0}
                   className="p-3 text-neutral-400 hover:text-white disabled:opacity-30"
                 >
                   Previous
                 </button>
                 
                 {currentWordIndex === words.length - 1 ? (
                   <button
                     onClick={generateQuiz}
                     disabled={loading}
                     className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-xl uppercase tracking-widest text-xs transition-colors flex items-center shadow-lg"
                   >
                     {loading ? 'Preparing Quiz...' : 'Take Quiz'}
                   </button>
                 ) : (
                   <button
                     onClick={() => setCurrentWordIndex(i => i + 1)}
                     className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-xl uppercase tracking-widest text-xs transition-colors"
                   >
                     Next Word
                   </button>
                 )}
               </div>
             </div>
          )}

          {phase === 'quiz' && questions.length > 0 && (
             <div className="py-4">
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                  <div className="text-xs font-black uppercase tracking-widest text-neutral-400">
                    Question {quizIndex + 1} of {questions.length}
                  </div>
                  <div className={`flex items-center text-sm font-bold bg-white/5 px-4 py-2 rounded-full ${timeLeft <= 10 ? 'text-rose-500 animate-pulse' : 'text-emerald-400'}`}>
                    <Clock size={16} className="mr-2" /> {timeLeft}s remaining
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-bold leading-relaxed mb-8">{questions[quizIndex].question}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {questions[quizIndex].options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleAnswer(opt)}
                        className="bg-white/5 hover:bg-indigo-600/30 border border-white/10 hover:border-indigo-500 p-4 rounded-xl text-left transition-all active:scale-95"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
             </div>
          )}

          {phase === 'result' && (
             <div className="py-8 text-center flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-indigo-900/30 border-4 border-indigo-500 flex items-center justify-center flex-col mb-8 shadow-[0_0_50px_rgba(79,70,229,0.2)]">
                  <span className="text-4xl font-black text-white">{score}</span>
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest border-t border-indigo-500/50 mt-1 pt-1 w-16">/ {questions.length}</span>
                </div>
                
                <h2 className="text-3xl font-black mb-2">Quiz Complete!</h2>
                <p className="text-neutral-400 mb-10">You got {score} out of {questions.length} correct.</p>

                {mistakes.length > 0 && (
                  <div className="w-full text-left bg-black/40 rounded-2xl p-6 border border-rose-500/20 mb-8">
                    <h3 className="text-rose-400 font-bold uppercase tracking-widest text-xs mb-6 border-b border-rose-500/10 pb-2">Areas to review</h3>
                    <div className="space-y-6">
                      {mistakes.map((m, i) => (
                        <div key={i} className="flex flex-col space-y-2">
                          <p className="text-sm text-neutral-300 font-medium">{m.q}</p>
                          <div className="flex items-center text-xs space-x-4">
                            <span className="text-rose-400 bg-rose-900/20 px-2 py-1 rounded">Your answer: {m.answered}</span>
                            <span className="text-emerald-400 bg-emerald-900/20 px-2 py-1 rounded font-bold">Correct: {m.correct}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setPhase('setup')}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-8 rounded-xl uppercase tracking-widest text-sm transition-colors flex items-center"
                >
                  <RefreshCcw size={16} className="mr-2" /> Start Over
                </button>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
