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
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-neutral-100"
        >
          <div className="h-24 w-24 bg-green-50 text-green-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-black text-neutral-900 mb-4 uppercase tracking-tight">Submission Successful</h1>
          <p className="text-neutral-500 mb-10 font-medium">Your answers have been uploaded to PB ACADEMIA's secure database.</p>
          
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
          >
            Return to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-neutral-900 uppercase tracking-tighter">{exam.title}</h1>
          <div className="flex items-center space-x-2 mt-2">
            <span className="px-2 py-0.5 bg-neutral-100 text-[10px] font-bold text-neutral-500 rounded uppercase tracking-widest">Official Assessment</span>
            <span className="text-neutral-400 text-[10px]">•</span>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{exam.questions.length} Questions</span>
          </div>
        </div>
        <div className={`flex items-center space-x-3 px-8 py-3 rounded-2xl border-4 font-mono font-black text-lg ${
          timeLeft < 300 ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : 'bg-white border-neutral-100 text-neutral-900 shadow-sm'
        }`}>
          <Clock className="h-6 w-6" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="bg-white p-12 rounded-[3.5rem] border border-neutral-100 shadow-2xl shadow-neutral-200/50 relative"
            >
              <div className="mb-10 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="h-10 w-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-sm">{currentQ + 1}</span>
                  <span className="px-3 py-1 bg-neutral-50 text-neutral-400 rounded-lg text-[10px] font-black uppercase tracking-[0.2em]">
                    {currentQuestion.type?.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest">{currentQuestion.points} Points</div>
              </div>
              
              <h2 className="text-2xl font-bold text-neutral-900 leading-tight mb-12">
                {currentQuestion.text}
              </h2>

              <div className="space-y-4">
                {currentQuestion.type === 'mcq' && currentQuestion.options?.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const newAns = [...answers];
                      newAns[currentQ] = idx;
                      setAnswers(newAns);
                    }}
                    className={`w-full p-6 text-left rounded-3xl border-2 transition-all flex items-center justify-between group ${
                      answers[currentQ] === idx 
                      ? 'border-blue-600 bg-blue-50/50 text-blue-900 shadow-sm' 
                      : 'border-neutral-50 bg-neutral-50/50 text-neutral-500 hover:border-neutral-200 hover:bg-white'
                    }`}
                  >
                    <span className="font-bold text-sm uppercase tracking-tight">{option}</span>
                    <div className={`h-8 w-8 rounded-2xl border flex items-center justify-center transition-colors ${
                      answers[currentQ] === idx ? 'bg-blue-600 border-blue-600' : 'border-neutral-200 group-hover:border-neutral-300'
                    }`}>
                      {answers[currentQ] === idx && <div className="h-2 w-2 bg-white rounded-full"></div>}
                    </div>
                  </button>
                ))}

                {(currentQuestion.type === 'short_answer' || currentQuestion.type === 'creative') && (
                  <textarea 
                    className="w-full p-6 bg-neutral-50 border-2 border-neutral-100 rounded-[2rem] outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all min-h-[200px] font-medium"
                    placeholder="Enter your response here..."
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

          <div className="mt-12 flex justify-between items-center">
            <button
              disabled={currentQ === 0}
              onClick={() => setCurrentQ(prev => prev - 1)}
              className="flex items-center space-x-2 px-8 py-4 rounded-2xl bg-white border border-neutral-100 text-neutral-400 font-black hover:text-neutral-900 transition-all disabled:opacity-20 uppercase tracking-widest text-[10px]"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back</span>
            </button>

            {currentQ === exam.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="px-12 py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-100"
              >
                Submit Examination
              </button>
            ) : (
              <button
                onClick={() => setCurrentQ(prev => prev + 1)}
                className="flex items-center space-x-2 px-10 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
              >
                <span>Nest Stage</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm">
            <h3 className="font-extrabold text-neutral-900 mb-6 text-xs uppercase tracking-[0.2em] opacity-30">Map</h3>
            <div className="grid grid-cols-4 gap-3">
              {exam.questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentQ(i)}
                  className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-sm transition-all border-2 ${
                    currentQ === i 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' 
                    : answers[i] !== -1 
                    ? 'bg-blue-50 text-blue-600 border-blue-200' 
                    : 'bg-neutral-50 text-neutral-200 border-neutral-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-neutral-900 p-8 rounded-[2.5rem] text-white">
            <div className="flex items-center space-x-2 text-blue-400 mb-4">
              <Info className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Protocol</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-medium">Ensure you have a stable connection. Once submitted, answers cannot be modified. Creative answers will be graded by your instructor within 48 hours.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
