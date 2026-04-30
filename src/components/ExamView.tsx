import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, addDoc, collection, serverTimestamp, doc, getDoc } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { Exam, Question } from '../types';
import { Clock, CheckCircle, ChevronRight, ChevronLeft, Flag, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ExamView() {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  
  const [exam, setExam] = useState<Exam | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | string)[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExam = async () => {
      if (!id) return;
      const docRef = doc(db, 'exams', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as Exam;
        setExam({ id: snap.id, ...data });
        setTimeLeft(data.durationMinutes * 60);
        setAnswers(new Array(data.questions.length).fill(-1));
      }
      setLoading(false);
    };
    fetchExam();
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0 && !submitted && exam) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !submitted && exam) {
      handleSubmit();
    }
  }, [timeLeft, submitted, exam]);

  const handleSubmit = async () => {
    if (!exam || !user) return;

    let finalScore = 0;
    exam.questions.forEach((q, idx) => {
      const ans = answers[idx];
      if (q.type === 'mcq' && ans === q.correctOption) finalScore += q.points;
      // Short answer and creative need teacher manual grading, or exact match for short answer
      if (q.type === 'short_answer' && q.correctAnswer && ans?.toString().toLowerCase() === q.correctAnswer.toLowerCase()) {
        finalScore += q.points;
      }
    });
    
    setSubmitted(true);

    try {
      await addDoc(collection(db, 'results'), {
        examId: id,
        studentId: user.uid,
        studentName: profile?.name,
        answers,
        score: finalScore,
        totalPoints: exam.questions.reduce((acc, current) => acc + (current.points || 0), 0),
        submittedAt: serverTimestamp(),
        status: exam.questions.some(q => q.type === 'creative') ? 'pending' : 'graded'
      });
    } catch (e) {
      console.error("Error saving result:", e);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="p-20 text-center font-bold text-neutral-400 animate-pulse">Loading Examination...</div>;
  if (!exam) return <div className="p-20 text-center">Exam not found or unavailable.</div>;

  const currentQuestion = exam.questions[currentQ];

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-32 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#0a0a0a] p-16 rounded-[4rem] shadow-[0_0_100px_rgba(37,99,235,0.1)] border border-white/5"
        >
          <div className="h-32 w-32 bg-blue-500/10 text-blue-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-12 shadow-2xl">
            <CheckCircle className="h-16 w-16" />
          </div>
          <h1 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter leading-tight">Data Uplink <br/> Successful</h1>
          <p className="text-neutral-500 mb-12 font-bold uppercase tracking-widest text-[10px] leading-loose">Your strategic assessment has been synchronized with PB ACADEMIA's secure neural grid.</p>
          
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full py-6 bg-blue-600 text-white rounded-3xl font-black uppercase tracking-[0.3em] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/30 text-[10px]"
          >
            Re-establish Dashboard Link
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
        <div>
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">{exam.title}</h1>
          <div className="flex items-center space-x-4 mt-6">
            <span className="px-4 py-1.5 bg-white/5 text-[9px] font-black text-blue-500 border border-white/10 rounded-full uppercase tracking-[0.2em]">Live Operation Active</span>
            <div className="h-1.5 w-1.5 rounded-full bg-neutral-800"></div>
            <span className="text-[9px] font-black text-neutral-500 uppercase tracking-[0.2em]">{exam.questions.length} Deployment Nodes</span>
          </div>
        </div>
        <div className={`flex items-center space-x-6 px-12 py-5 rounded-[2rem] border-2 font-mono font-black text-2xl transition-all shadow-2xl ${
          timeLeft < 300 ? 'bg-red-500/10 border-red-500 text-red-500 animate-pulse' : 'bg-[#0a0a0a] border-white/5 text-white'
        }`}>
          <Clock className="h-8 w-8 text-blue-500" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-[#0a0a0a] p-16 rounded-[4rem] border border-white/5 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full"></div>
              <div className="mb-12 flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-4">
                  <span className="h-16 w-16 bg-blue-600 text-white rounded-[1.5rem] flex items-center justify-center font-black text-2xl shadow-2xl shadow-blue-500/30">
                    {String(currentQ + 1).padStart(2, '0')}
                  </span>
                  <span className="px-5 py-2 bg-white/5 text-neutral-400 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border border-white/5">
                    Mode: {currentQuestion.type?.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.4em]">{currentQuestion.points} Value Points</div>
              </div>
              
              <h2 className="text-3xl font-black text-white leading-tight mb-16 relative z-10">
                {currentQuestion.text}
              </h2>

              <div className="space-y-4 relative z-10">
                {currentQuestion.type === 'mcq' && currentQuestion.options?.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const newAns = [...answers];
                      newAns[currentQ] = idx;
                      setAnswers(newAns);
                    }}
                    className={`w-full p-8 text-left rounded-[2rem] border-2 transition-all flex items-center justify-between group shadow-xl ${
                      answers[currentQ] === idx 
                      ? 'border-blue-600 bg-blue-600/5 text-white' 
                      : 'border-white/5 bg-white/[0.02] text-neutral-500 hover:border-white/10 hover:bg-white/[0.04]'
                    }`}
                  >
                    <span className="font-bold text-sm uppercase tracking-tight leading-relaxed">{option}</span>
                    <div className={`h-10 w-10 rounded-2xl border flex items-center justify-center transition-all ${
                      answers[currentQ] === idx ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-500/50' : 'border-white/10 group-hover:border-white/20'
                    }`}>
                      {answers[currentQ] === idx && <div className="h-2.5 w-2.5 bg-white rounded-full"></div>}
                    </div>
                  </button>
                ))}

                {(currentQuestion.type === 'short_answer' || currentQuestion.type === 'creative') && (
                  <textarea 
                    className="w-full p-10 bg-black/40 border-2 border-white/5 rounded-[3rem] outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all min-h-[300px] font-bold text-white placeholder:text-neutral-700"
                    placeholder="Enter strategic response..."
                    value={answers[currentQ] === -1 ? '' : answers[currentQ].toString()}
                    onChange={(e) => {
                      const newAns = [...answers];
                      newAns[currentQ] = e.target.value;
                      setAnswers(newAns);
                    }}
                  />
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-16 flex justify-between items-center px-4">
            <button
              disabled={currentQ === 0}
              onClick={() => setCurrentQ(prev => prev - 1)}
              className="flex items-center space-x-3 px-12 py-5 rounded-full bg-white/5 border border-white/5 text-neutral-500 font-black hover:text-white hover:border-white/10 transition-all disabled:opacity-0 uppercase tracking-widest text-[9px]"
            >
              <ChevronLeft className="h-5 w-5" />
              <span>Retreat Step</span>
            </button>

            {currentQ === exam.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="px-16 py-5 bg-red-600 text-white rounded-full font-black uppercase tracking-[0.3em] hover:bg-red-700 transition-all shadow-2xl shadow-red-500/30 text-[10px]"
              >
                Execute Submission
              </button>
            ) : (
              <button
                onClick={() => setCurrentQ(prev => prev + 1)}
                className="flex items-center space-x-3 px-16 py-5 bg-blue-600 text-white rounded-full font-black uppercase tracking-[0.3em] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/30 text-[10px]"
              >
                <span>Nest Node</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 shadow-2xl">
            <h3 className="font-black text-neutral-700 mb-8 text-[9px] uppercase tracking-[0.5em] text-center italic">Operational Map</h3>
            <div className="grid grid-cols-4 gap-4">
              {exam.questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentQ(i)}
                  className={`h-14 w-14 rounded-2xl flex items-center justify-center font-black text-xs transition-all border-2 ${
                    currentQ === i 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xl shadow-blue-500/30 rotate-12 scale-110' 
                    : answers[i] !== -1 
                    ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' 
                    : 'bg-white/5 text-neutral-700 border-transparent hover:border-white/10'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/5 p-10 rounded-[3rem] border border-white/5 backdrop-blur-xl">
            <div className="flex items-center space-x-3 text-blue-500 mb-6">
              <Info className="h-5 w-5" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em]">Protocol Info</span>
            </div>
            <p className="text-[10px] text-neutral-500 leading-loose font-bold uppercase tracking-widest italic text-center">Stability required. No manual reversal after sync. Creative modules require manual instructor verification.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
