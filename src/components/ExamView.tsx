import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { uploadToCloudinary } from '../lib/cloudinary';
import { db, addDoc, collection, serverTimestamp, doc, getDoc } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { Exam, Question } from '../types';
import { Clock, CheckCircle, ChevronRight, ChevronLeft, Flag, Info, FileText, Send, Loader2, Link as LinkIcon, ArrowRight, Download } from 'lucide-react';
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
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchExam = async () => {
      if (!id) return;
      const docRef = doc(db, 'exams', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as Exam;
        setExam({ id: snap.id, ...data });
        
        // Calculate remaining time
        const startTime = new Date(data.startTime);
        const duration = data.durationMinutes || 60;
        const endTime = new Date(startTime.getTime() + duration * 60000);
        const now = new Date();
        const diffSeconds = Math.max(0, Math.floor((endTime.getTime() - now.getTime()) / 1000));
        
        setTimeLeft(diffSeconds);

        if (data.questions) {
          setAnswers(new Array(data.questions.length).fill(-1));
        }
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
      if (exam.examType === 'CQ') {
        // Just stop the timer, student might need to upload
      } else {
        handleSubmit();
      }
    }
  }, [timeLeft, submitted, exam]);

  const handleSubmit = async () => {
    if (!exam || !user) return;
    if (!exam.questions) return;

    let finalScore = 0;
    exam.questions.forEach((q, idx) => {
      const ans = answers[idx];
      if (q.type === 'mcq' && ans === q.correctOption) finalScore += q.points;
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
        totalPoints: exam.questions?.reduce((acc, current) => acc + (current.points || 0), 0) || 0,
        submittedAt: serverTimestamp(),
        status: exam.questions?.some(q => q.type === 'creative') ? 'pending' : 'graded'
      });
    } catch (e) {
      console.error("Error saving result:", e);
    }
  };

  const handleSubmitCQ = async () => {
    if (!submissionFile || !user || !exam) return;
    
    setSubmitting(true);
    setUploadProgress(0);

    try {
      const downloadUrl = await uploadToCloudinary(submissionFile, (progress) => setUploadProgress(progress));

      await addDoc(collection(db, 'examSubmissions'), {
        examId: exam.id,
        studentId: user.uid,
        studentName: profile?.name || 'Anonymous Student',
        ansUrl: downloadUrl,
        submittedAt: new Date().toISOString(),
        graded: false
      });

      setSubmitted(true);
    } catch (e: any) {
      console.error("Submission Error:", e);
      alert(`জমা দিতে ব্যর্থ হয়েছে: ${e.message || 'Unknown error'}`);
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-20">
      <div className="h-10 w-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
  
  if (!exam) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-20 text-center">
       <div className="h-24 w-24 bg-red-600/10 text-red-500 rounded-[2rem] flex items-center justify-center mb-10">
          <Info className="h-10 w-10" />
       </div>
       <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Exam Unavailable</h1>
       <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px] mb-12">The assessment link you followed is invalid or has expired.</p>
       <button onClick={() => navigate('/dashboard')} className="px-10 py-4 bg-white/5 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] border border-white/10">Return to HQ</button>
    </div>
  );

  const answeredCount = answers.filter(a => a !== -1 && a !== '').length;
  const progressPercent = exam.questions ? (answeredCount / exam.questions.length) * 100 : 0;

  // Handle tactical exam types (CQ / MCQ via link)
  if (exam.examType === 'CQ' || exam.examType === 'MCQ') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-blue-600 rounded-2xl">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">{exam.title}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-4 py-1.5 bg-white/5 text-[9px] font-black text-blue-500 border border-white/10 rounded-full uppercase tracking-[0.2em]">Operational Module: {exam.examType}</span>
              {timeLeft > 0 && (
                <div className="flex items-center space-x-3 text-red-500 font-mono font-black text-xl bg-red-500/10 px-6 py-2 rounded-xl border border-red-500/20 shadow-lg">
                  <Clock className="h-5 w-5" />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              )}
            </div>
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3 bg-white/5 text-neutral-500 rounded-xl font-black uppercase tracking-widest text-[9px] hover:text-white transition-all border border-white/10"
          >
            Exit Terminal
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Question Viewport */}
          <div className="bg-[#0a0a0a] rounded-[3.5rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col">
            <div className="p-8 border-b border-white/5 bg-black/40 flex items-center justify-between flex-wrap gap-4">
              <h3 className="text-[10px] font-black text-neutral-500 uppercase tracking-widest flex items-center">
                <FileText className="h-4 w-4 mr-3 text-blue-500" />
                Question Paper / প্রশ্নপত্র
              </h3>
              {exam.examType === 'CQ' && exam.questionUrl && (
                <a 
                  href={exam.questionUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-5 py-2 bg-blue-600/10 border border-blue-500/30 text-blue-400 hover:bg-blue-600 hover:text-white rounded-xl flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all"
                >
                  <Download className="w-3 h-3" />
                  Download
                </a>
              )}
            </div>
            <div className="flex-grow p-1 overflow-hidden">
               {exam.examType === 'CQ' ? (
                  <div className="h-[75vh] min-h-[600px] bg-black rounded-[2.5rem] overflow-hidden">
                    {exam.questionUrl ? (
                      <object data={exam.questionUrl} type="application/pdf" className="w-full h-full">
                        <iframe src={exam.questionUrl} className="w-full h-full" title="Question Paper" />
                      </object>
                    ) : (
                      <div className="h-full flex items-center justify-center text-neutral-800 font-black uppercase tracking-widest text-[10px] italic">
                        Synchronizing Tactical Question Data...
                      </div>
                    )}
                  </div>
               ) : (
                  <div className="h-[600px] flex flex-col items-center justify-center text-center p-12">
                      <LinkIcon className="h-16 w-16 text-purple-600 mb-8 animate-pulse" />
                      <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-6">MCQ Integration Detected</h2>
                      <p className="text-neutral-500 font-bold text-[10px] uppercase tracking-[0.3em] leading-relaxed mb-12 max-w-sm">
                        This is an external assessment. Please click the button below to join the strategic combat mission on Google Forms.
                      </p>
                      <a 
                        href={exam.googleFormLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-16 py-6 bg-purple-600 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] inline-block shadow-[0_0_50px_rgba(147,51,234,0.3)] hover:scale-105 transition-all"
                      >
                        Launch Google Form Link
                      </a>
                  </div>
               )}
            </div>
          </div>

          {/* Submission / Status Panel */}
          <div className="space-y-10">
            <div className="bg-[#0a0a0a] rounded-[3.5rem] border border-white/10 p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full"></div>
              
              {submitted ? (
                 <div className="text-center py-10">
                    <div className="h-24 w-24 bg-emerald-500/10 text-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl">
                      <CheckCircle className="h-12 w-12" />
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Submission Captured!</h2>
                    <p className="text-neutral-500 font-bold uppercase tracking-widest text-[9px] mb-12">Your tactical response has been securely archived. Our instructors will evaluate your mission soon.</p>
                    <button onClick={() => navigate('/dashboard')} className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-emerald-600/30">Back to Dashboard</button>
                 </div>
              ) : (
                <div className="relative z-10">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight mb-8">Submission Portal</h3>
                  
                  {exam.examType === 'CQ' ? (
                    <div className="space-y-8">
                       <p className="text-neutral-500 font-bold uppercase tracking-widest text-[9px] leading-relaxed italic">
                         Download the question, solve it on your paper, scan it (PDF/Image) and upload it here before the timer expires.
                       </p>
                       
                       <label className="flex flex-col items-center justify-center w-full p-12 border-2 border-dashed border-white/10 rounded-[2.5rem] bg-black/40 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer group">
                          <Send className="h-10 w-10 text-neutral-700 group-hover:text-blue-500 mb-4 transition-colors" />
                          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 text-center">
                            {submissionFile ? submissionFile.name : 'Select Answer Script (PDF/Image)'}
                          </p>
                          <input type="file" className="hidden" accept="image/*,application/pdf" onChange={(e) => setSubmissionFile(e.target.files?.[0] || null)} />
                       </label>

                       <button 
                          onClick={handleSubmitCQ}
                          disabled={!submissionFile || submitting || timeLeft === 0}
                          className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/30 disabled:opacity-30 flex flex-col items-center justify-center gap-1"
                       >
                         <div className="flex items-center space-x-3">
                           {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                           <span>{submitting ? 'Transmitting Data...' : 'Submit Answer Paper'}</span>
                         </div>
                         {submitting && uploadProgress > 0 && (
                            <span className="text-[8px] opacity-70">Progress: {uploadProgress}%</span>
                         )}
                       </button>

                       {timeLeft === 0 && (
                         <div className="flex items-center space-x-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[9px] font-black uppercase tracking-widest">
                           <Info className="h-4 w-4" />
                           <span>Tactical window closed. Late submissions restricted.</span>
                         </div>
                       )}
                    </div>
                  ) : (
                    <div className="space-y-8">
                       <p className="text-neutral-500 font-bold uppercase tracking-widest text-[9px] leading-relaxed italic">
                         For MCQ assessments, please follow the Google Form link on the left. Your score will be imported automatically.
                       </p>
                       <div className="p-8 bg-purple-500/10 border border-purple-500/20 rounded-[2rem] flex flex-col items-center text-center">
                          <CheckCircle className="h-8 w-8 text-purple-500 mb-4" />
                          <p className="text-[10px] font-black text-white uppercase tracking-widest">Auto-Sync Enabled</p>
                       </div>
                       <button onClick={() => navigate('/dashboard')} className="w-full py-5 bg-white/5 border border-white/10 text-neutral-500 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:text-white transition-all">Done - Return to Dashboard</button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Tactical Briefing */}
            <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 p-10 rounded-[3rem] border border-white/10 shadow-2xl">
              <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Mission Status</h4>
              <div className="space-y-4">
                 <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-neutral-400">
                    <span>Signal Strength</span>
                    <span className="text-emerald-500">EXCELLENT</span>
                 </div>
                 <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-neutral-400">
                    <span>Authentication</span>
                    <span className="text-emerald-500">VERIFIED</span>
                 </div>
                 <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-neutral-400">
                    <span>Latency</span>
                    <span className="text-neutral-500">12ms Dhaka Node</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = exam.questions?.[currentQ];
  if (!currentQuestion) return <div className="p-20 text-center">Invalid question mapping.</div>;

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
          {/* Visual Progress Bar */}
          <div className="mb-8 px-4 h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              className="absolute h-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_20px_rgba(37,99,235,0.5)]"
            />
          </div>

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
          <div className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-blue-600/20"></div>
             <div className="flex items-center justify-between mb-8">
               <h3 className="font-black text-neutral-700 text-[10px] uppercase tracking-[0.5em] italic">Deployment Grid</h3>
               <span className="text-[10px] font-black text-blue-500/60 uppercase tracking-widest">
                 {answeredCount}/{exam.questions.length}
               </span>
             </div>
            <div className="grid grid-cols-5 gap-3">
              {exam.questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentQ(i)}
                  title={`Jump to Question ${i + 1}`}
                  className={`h-11 w-11 rounded-xl flex items-center justify-center font-black text-[10px] transition-all border-2 ${
                    currentQ === i 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xl shadow-blue-500/30 scale-110 z-10' 
                    : answers[i] !== -1 && answers[i] !== ''
                    ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' 
                    : 'bg-white/5 text-neutral-600 border-white/5 hover:border-white/20'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
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
