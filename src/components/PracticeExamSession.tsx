import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { practiceSets, Question } from '../data/practiceQuestions';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, ChevronRight, ChevronLeft, CheckCircle2, XCircle, Timer, Award, RotateCcw } from 'lucide-react';

export default function PracticeExamSession() {
  const { setId } = useParams();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const set = practiceSets.find(s => s.id === setId);

  useEffect(() => {
    if (!set) {
      navigate('/practice-exams');
      return;
    }
    setTimeLeft(set.durationMinutes * 60);
    setStartTime(Date.now());
    setLoading(false);
  }, [set, navigate]);

  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, isFinished]);

  if (loading || !set) return null;

  const currentQuestion = set.questions[currentQuestionIndex];
  
  const handleAnswerSelect = (optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionIndex }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < set.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const calculateResults = () => {
    let correct = 0;
    set.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    return {
      correct,
      total: set.questions.length,
      score: Math.round((correct / set.questions.length) * 100),
      timeTaken
    };
  };

  if (isFinished) {
    const results = calculateResults();
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 lg:p-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full bg-[#0a0a0a] border border-white/5 rounded-[4rem] p-12 text-center"
        >
          <div className="h-24 w-24 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white mx-auto mb-10 shadow-2xl shadow-blue-600/30">
            <Award className="h-12 w-12" />
          </div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Exam Completed!</h2>
          <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs mb-12">Your performance breakdown</p>
          
          <div className="grid grid-cols-2 gap-6 mb-12">
            <div className="bg-white/5 p-8 rounded-[2rem]">
              <div className="text-3xl font-black text-white mb-2">{results.score}%</div>
              <div className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Final Score</div>
            </div>
            <div className="bg-white/5 p-8 rounded-[2rem]">
              <div className="text-3xl font-black text-white mb-2">{Math.floor(results.timeTaken / 60)}:{String(results.timeTaken % 60).padStart(2, '0')}</div>
              <div className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Time Taken</div>
            </div>
          </div>

          <div className="space-y-4 mb-12">
            {set.questions.map((q, i) => {
              const userAnswer = answers[q.id];
              const isCorrect = userAnswer === q.correctAnswer;
              return (
                <div key={q.id} className="flex items-start bg-white/[0.02] p-6 rounded-2xl border border-white/5 text-left">
                  <div className="mr-4 mt-1">
                    {isCorrect ? <CheckCircle2 className="text-green-500 h-5 w-5" /> : <XCircle className="text-red-500 h-5 w-5" />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white mb-2">{i+1}. {q.text}</div>
                    <div className="text-[10px] uppercase font-black tracking-widest">
                      <span className="text-neutral-500 mr-2">Your Answer:</span>
                      <span className={isCorrect ? 'text-green-500' : 'text-red-500'}>{q.options[userAnswer] || 'None'}</span>
                    </div>
                    {!isCorrect && (
                      <div className="text-[10px] uppercase font-black tracking-widest mt-1">
                        <span className="text-neutral-500 mr-2">Correct:</span>
                        <span className="text-blue-500">{q.options[q.correctAnswer]}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => window.location.reload()}
              className="flex-1 px-8 py-5 bg-white/5 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-3 hover:bg-white/10 transition-all"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Retry Exam</span>
            </button>
            <button 
              onClick={() => navigate('/practice-exams')}
              className="flex-1 px-8 py-5 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-3 shadow-xl shadow-blue-600/20 hover:scale-[1.02] transition-all"
            >
              <span>Back To Hub</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#050505] p-6 lg:p-20">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">{set.title}</h1>
            <div className="flex items-center space-x-4 text-[10px] font-black text-neutral-500 uppercase tracking-widest">
              <span>Class {set.class}</span>
              <span className="h-1 w-1 bg-neutral-700 rounded-full"></span>
              <span>Question {currentQuestionIndex + 1} of {set.questions.length}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4 px-6 py-3 bg-red-600/10 border border-red-600/20 rounded-2xl">
            <Timer className="h-4 w-4 text-red-500" />
            <span className="font-mono font-black text-red-500 text-lg">{formatTime(timeLeft)}</span>
          </div>
        </header>

        <div className="mb-12">
          <div className="h-1 w-full bg-white/5 rounded-full mb-2 overflow-hidden">
            <motion.div 
              className="h-full bg-blue-600"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestionIndex + 1) / set.questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-8 md:p-14 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl md:text-3xl font-black text-white mb-16 leading-tight">
                {currentQuestion.text}
              </h2>

              <div className="grid gap-4">
                {currentQuestion.options.map((option, i) => {
                  const isSelected = answers[currentQuestion.id] === i;
                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswerSelect(i)}
                      className={`w-full flex items-center p-6 md:p-8 rounded-[1.5rem] border transition-all text-left group ${
                        isSelected 
                        ? 'bg-blue-600/10 border-blue-600 shadow-xl shadow-blue-600/5' 
                        : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className={`h-8 w-8 rounded-full border flex items-center justify-center mr-6 font-black text-xs transition-all ${
                        isSelected 
                        ? 'bg-blue-600 border-blue-600 text-white' 
                        : 'border-white/10 text-neutral-500 group-hover:border-white/30'
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className={`font-bold transition-colors ${isSelected ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-200'}`}>
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-16 pt-12 border-t border-white/5 flex items-center justify-between">
            <button
              onClick={() => currentQuestionIndex > 0 && setCurrentQuestionIndex(v => v - 1)}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 text-neutral-500 hover:text-white disabled:opacity-0 transition-all font-black uppercase tracking-widest text-[10px] flex items-center space-x-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>
            <button
              onClick={handleNext}
              disabled={answers[currentQuestion.id] === undefined}
              className="px-10 py-5 bg-white text-black rounded-[1.3rem] font-black uppercase tracking-widest text-[10px] flex items-center space-x-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50 disabled:hover:scale-100"
            >
              <span>{currentQuestionIndex === set.questions.length - 1 ? 'Finish' : 'Next Question'}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
