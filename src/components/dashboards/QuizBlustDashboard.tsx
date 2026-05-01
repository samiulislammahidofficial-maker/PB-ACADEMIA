import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { db, collection, query, where, getDocs, addDoc, serverTimestamp, onSnapshot, orderBy, updateDoc, doc, storage, ref, uploadBytes, getDownloadURL } from '../../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket, Clock, CheckCircle2, AlertTriangle, FileText, Link as LinkIcon, Send, Trophy, List, PlusCircle, ArrowRight } from 'lucide-react';
import ExamCreator from '../teachers/ExamCreator';
import CountdownClock from '../common/CountdownClock';
import SubmissionGrader from '../teachers/SubmissionGrader';

export default function QuizBlustDashboard() {
  const { user, profile } = useAuth();
  const [isRegistered, setIsRegistered] = useState(false);
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreator, setShowCreator] = useState(false);
  const [activeExam, setActiveExam] = useState<any>(null);
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [gradingExam, setGradingExam] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    // Check registration
    const checkReg = async () => {
      const q = query(collection(db, 'quizblust_registrations'), where('studentId', '==', user.uid));
      const snap = await getDocs(q);
      setIsRegistered(!snap.empty);
    };

    if (profile?.role === 'student') checkReg();

    // Listen to exams
    const q = query(
      collection(db, 'exams'), 
      where('isQuizBlust', '==', true),
      orderBy('startTime', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snap) => {
      const list: any[] = [];
      snap.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
      setExams(list);
      setLoading(false);
    });

    // Listen to results for the leaderboard (last 2 days)
    const resultsQ = query(
      collection(db, 'examSubmissions'),
      where('graded', '==', true),
      orderBy('submittedAt', 'desc')
    );

    const unsubscribeResults = onSnapshot(resultsQ, (snap) => {
      const list: any[] = [];
      snap.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
      // Filter results within 2 days
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const filtered = list.filter(r => new Date(r.submittedAt) > twoDaysAgo);
      setResults(filtered);
    });

    return () => {
      unsubscribe();
      unsubscribeResults();
    };
  }, [user, profile]);

  const handleRegister = async () => {
    if (!user) return;
    setRegistering(true);
    try {
      await addDoc(collection(db, 'quizblust_registrations'), {
        studentId: user.uid,
        registeredAt: serverTimestamp()
      });
      setIsRegistered(true);
      alert('সফলভাবে রেজিস্ট্রেশন সম্পন্ন হয়েছে!');
    } catch (e) {
      alert('রেজিস্ট্রেশনে ত্রুটি হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setRegistering(false);
    }
  };

  const handleSubmitCQ = async (examId: string) => {
    if (!submissionFile || !user) return;
    setSubmitting(true);
    try {
      const fileRef = ref(storage, `submissions/${examId}_${user.uid}_${Date.now()}_${submissionFile.name}`);
      const uploadResult = await uploadBytes(fileRef, submissionFile);
      const downloadUrl = await getDownloadURL(uploadResult.ref);

      await addDoc(collection(db, 'examSubmissions'), {
        examId,
        studentId: user.uid,
        studentName: profile?.name || 'Anonymous Student',
        ansUrl: downloadUrl,
        submittedAt: new Date().toISOString(),
        graded: false
      });
      alert('আপনার উত্তরপত্র সফলভাবে জমা দেওয়া হয়েছে!');
      setActiveExam(null);
      setSubmissionFile(null);
    } catch (e) {
      console.error(e);
      alert('জমা দিতে ব্যর্থ হয়েছে।');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="h-10 w-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-xl shadow-blue-600/20">
              <Rocket className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
              Quiz<span className="text-blue-500">Blust</span>
            </h1>
          </div>
          <p className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.4em] italic">
            Elite Academic Assessment System // Next Gen Learning
          </p>
        </div>

        {profile?.role === 'teacher' && (
          <button 
            onClick={() => setShowCreator(true)}
            className="flex items-center space-x-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/20 uppercase tracking-widest text-[10px]"
          >
            <PlusCircle className="h-4 w-4" />
            <span>নতুন পরীক্ষা তৈরি করুন</span>
          </button>
        )}
      </div>

      {/* Registration Banner for Students */}
      {profile?.role === 'student' && !isRegistered && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-12 p-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group"
        >
          <div className="relative z-10">
            <h2 className="text-3xl font-black uppercase tracking-tight mb-4">QuizBlust এ যোগ দিন!</h2>
            <p className="text-blue-100 font-bold text-sm max-w-xl leading-relaxed mb-8">
              অস্টম শ্রেণীর শিক্ষার্থীদের জন্য এটি সম্পূর্ণ ফ্রি। সেরা মেন্টরদের তৈরি পরীক্ষায় অংশ নিন এবং আপনার মেধা যাচাই করুন।
            </p>
            <button 
              onClick={handleRegister}
              className="px-10 py-5 bg-white text-blue-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-xl"
            >
              বিনামূল্যে যুক্ত হোন
            </button>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform"></div>
        </motion.div>
      )}

      {/* Upcoming Exam Alert */}
      {profile?.role === 'student' && isRegistered && (
        <div className="mb-12">
          {(() => {
            const nextExam = exams
              .filter(e => new Date(e.startTime) > new Date())
              .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0];
            
            if (!nextExam) return null;

            return (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-1 w-full bg-gradient-to-r from-amber-500/50 via-yellow-500/50 to-amber-500/50 rounded-[2.6rem] shadow-2xl shadow-amber-500/10 mb-12"
              >
                <div className="p-8 bg-[#0a0a0a] rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-center space-x-6">
                    <div className="h-16 w-16 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-amber-500/30">
                      <AlertTriangle className="h-8 w-8 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white uppercase tracking-tight">আসন্ন পরীক্ষার সতর্কতা!</h3>
                      <p className="text-amber-500 font-bold text-[10px] uppercase tracking-widest mt-1">
                        {nextExam.title} শুরু হবে {new Date(nextExam.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} মিনিটে
                      </p>
                    </div>
                  </div>
                  <div className="bg-black/60 px-10 py-6 rounded-2xl border border-white/5 shadow-inner">
                    <CountdownClock targetDate={nextExam.startTime} prefix="পরীক্ষা শুরু হতে বাকি" />
                  </div>
                </div>
              </motion.div>
            );
          })()}
        </div>
      )}

      {/* Intro Header */}
      <div className="relative rounded-[3.5rem] overflow-hidden mb-16 border border-white/5 shadow-2xl h-[400px] flex items-center group">
        <img src="https://i.ibb.co.com/ZpTkHT4q/Untitled-design-8.png" className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000" alt="QuizBlust Header" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
        <div className="relative z-10 p-12 md:p-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter">
              QUIZ<span className="text-blue-500">BLUST</span>
            </h1>
            <p className="mt-4 text-neutral-400 font-bold uppercase tracking-[0.4em] text-[10px]">
              এক্সাম সলভ ব্যাচ • তোমার জন্য সম্পূর্ণ ফ্রি কোর্স
            </p>
            <div className="mt-12 flex items-center space-x-6">
              {!isRegistered && (
                <button 
                  onClick={handleRegister}
                  disabled={registering}
                  className="px-12 py-6 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-2xl shadow-blue-600/30"
                >
                  {registering ? 'প্রসেসিং...' : 'ফ্রি এনরোল করো (এখনই!)'}
                </button>
              )}
              {isRegistered && (
                <span className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-green-500 uppercase tracking-widest">
                  তুমি এনরোলড আছো! 
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-10">
        
        {/* Left: Exam List & Action */}
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-[#0a0a0a] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
            <div className="p-10 border-b border-white/5 bg-black/20 flex justify-between items-center">
              <h3 className="font-black text-white uppercase tracking-widest text-sm flex items-center">
                <Clock className="h-4 w-4 mr-3 text-blue-500" />
                পরীক্ষার তালিকা
              </h3>
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>

            <div className="divide-y divide-white/5">
              {exams.length === 0 ? (
                <div className="p-20 text-center text-neutral-600 font-black uppercase tracking-widest text-[10px]">
                  এখনও কোনো পরীক্ষা নির্ধারিত হয়নি।
                </div>
              ) : (
                exams.map((exam) => {
                  const startTime = new Date(exam.startTime);
                  const endTime = new Date(startTime.getTime() + exam.durationMinutes * 60000);
                  const isLive = new Date() >= startTime && new Date() <= endTime;
                  const isFinished = new Date() > endTime;
                  const isUpcoming = new Date() < startTime;

                  return (
                    <div key={exam.id} className="p-10 hover:bg-white/[0.01] transition-colors group">
                      <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="flex items-start space-x-6">
                          <div className={`h-16 w-16 min-w-[4rem] rounded-2xl flex items-center justify-center text-white shadow-2xl ${
                            exam.examType === 'CQ' ? 'bg-orange-600' : 'bg-purple-600'
                          }`}>
                            {exam.examType === 'CQ' ? <FileText className="h-8 w-8" /> : <LinkIcon className="h-8 w-8" />}
                          </div>
                          <div>
                            <div className="flex items-center space-x-3 mb-2">
                              <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${
                                isLive ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                isUpcoming ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                'bg-neutral-500/10 text-neutral-500 border-neutral-500/20'
                              }`}>
                                {isLive ? 'Live Exam' : isUpcoming ? 'Upcoming' : 'Closed'}
                              </span>
                              <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest italic">
                                {exam.examType} MODULE
                              </span>
                            </div>
                            <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2">{exam.title}</h4>
                            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
                                {startTime.toLocaleDateString()} • {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-4 min-w-[200px]">
                          {isUpcoming && (
                            <CountdownClock targetDate={exam.startTime} prefix="STARTING IN" />
                          )}
                          
                          {profile?.role === 'student' && isRegistered && isLive && (
                            <button 
                              onClick={() => setActiveExam(exam)}
                              className="w-full px-8 py-4 bg-green-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-xl shadow-green-600/20"
                            >
                              পরীক্ষায় অংশ নিন
                            </button>
                          )}

                          {profile?.role === 'teacher' && (
                            <button 
                              onClick={() => setGradingExam(exam)}
                              className="w-full px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                            >
                              <span>খাতা দেখুন</span>
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right: Results / Leaderboard */}
        <div className="space-y-10">
          <div className="bg-[#0a0a0a] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/5 bg-black/20 flex items-center justify-between">
              <h3 className="font-black text-white uppercase tracking-widest text-xs flex items-center">
                <Trophy className="h-4 w-4 mr-3 text-yellow-500" />
                ফলাফল বোর্ড
              </h3>
              <span className="text-[8px] font-black text-neutral-600 uppercase tracking-widest">LAST 48H</span>
            </div>
            
            <div className="p-8 space-y-6">
              {results.length === 0 ? (
                <div className="py-10 text-center text-neutral-600 font-black uppercase tracking-widest text-[8px]">
                  এখনও কোনো ফলাফল প্রকাশ করা হয়নি।
                </div>
              ) : (
                results.slice(0, 10).map((res, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 bg-black/20 rounded-2xl border border-white/5">
                    <div className="h-10 w-10 min-w-[2.5rem] rounded-xl bg-white/5 flex items-center justify-center text-white font-black text-sm tabular-nums">
                      {i + 1}
                    </div>
                    <div className="flex-grow">
                      <h5 className="font-black text-white uppercase tracking-tight text-xs">{res.studentName}</h5>
                      <p className="text-[8px] text-neutral-600 font-bold uppercase tracking-widest mt-0.5">SCORE: {res.marks} PTS</p>
                    </div>
                    {i < 3 && (
                      <Trophy className={`h-4 w-4 ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-neutral-300' : 'text-amber-700'}`} />
                    )}
                  </div>
                ))
              )}
            </div>
            
            <div className="p-6 bg-white/[0.02] border-t border-white/5 text-center">
              <p className="text-[8px] font-black text-neutral-500 uppercase tracking-widest">
                Real-time Syncing // Elite Ranking Active
              </p>
            </div>
          </div>

          {/* Current Time Widget */}
          <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 p-8 rounded-[3rem] border border-white/5 shadow-2xl text-center">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-4">Tactical Time</p>
            <div className="text-4xl font-black text-white tracking-tighter tabular-nums mb-2">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
            </div>
            <p className="text-[8px] text-neutral-500 font-bold uppercase tracking-widest italic">
              Dhaka Node Sync: OK
            </p>
          </div>
        </div>
      </div>

      {/* Live Exam Modal */}
      <AnimatePresence>
        {activeExam && (
          <div className="fixed inset-0 bg-black/95 z-[60] flex flex-col p-6 md:p-12">
            <div className="max-w-6xl mx-auto w-full flex flex-col h-full bg-[#0a0a0a] rounded-[4rem] border border-white/10 shadow-[0_0_100px_rgba(59,130,246,0.1)] overflow-hidden">
              <div className="p-10 border-b border-white/5 flex flex-col md:flex-row justify-between items-center bg-black/40 gap-6">
                <div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tighter">{activeExam.title}</h2>
                  <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mt-1 italic">Status: Tactical Combat Active</p>
                </div>
                <div className="bg-red-600/10 px-8 py-4 rounded-2xl border border-red-600/20">
                  <CountdownClock 
                    targetDate={new Date(new Date(activeExam.startTime).getTime() + activeExam.durationMinutes * 60000).toISOString()} 
                    prefix="REMAINING CHRONO"
                    onFinish={() => {
                        if (activeExam.examType === 'CQ') alert('সময় শেষ! আমরা খাতা জমা দিচ্ছি।');
                        setActiveExam(null);
                    }}
                  />
                </div>
              </div>

              <div className="flex-grow grid lg:grid-cols-2 overflow-hidden">
                {/* Question Section */}
                <div className="p-10 overflow-y-auto border-r border-white/5 bg-black/40">
                  <h3 className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-6 flex items-center">
                    <FileText className="h-4 w-4 mr-3 text-blue-500" />
                    প্রশ্নপত্র (Question Paper)
                  </h3>
                  {activeExam.examType === 'CQ' ? (
                    <div className="aspect-[3/4] w-full bg-black rounded-3xl border border-white/5 flex items-center justify-center text-neutral-700">
                      {activeExam.questionUrl ? (
                        <iframe src={activeExam.questionUrl} className="w-full h-full rounded-3xl" />
                      ) : (
                        <p className="font-black text-xs uppercase italic">Synchronizing Tactical Data...</p>
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-center p-10">
                      <div>
                        <LinkIcon className="h-16 w-16 text-purple-500 mx-auto mb-6 animate-pulse" />
                        <h4 className="text-xl font-black text-white uppercase tracking-tight mb-4">MCQ Integration Detected</h4>
                        <p className="text-neutral-500 font-bold text-xs uppercase tracking-widest leading-relaxed mb-10 max-w-sm">
                          এটি একটি এক্সটারনাল MCQ পরীক্ষা। নিচের লিঙ্কে ক্লিক করে উত্তর দিন।
                        </p>
                        <a 
                          href={activeExam.googleFormLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-12 py-5 bg-purple-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] inline-block shadow-2xl shadow-purple-600/20 hover:scale-105 transition-all"
                        >
                          GOOGLE FORM এ যান
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submission Section (Only for CQ) */}
                <div className="p-10 overflow-y-auto bg-black/20">
                  {activeExam.examType === 'CQ' ? (
                    <div className="h-full flex flex-col justify-center max-w-md mx-auto">
                      <h3 className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-8 text-center">
                        জমা দেওয়ার মাধ্যম (Submission Portal)
                      </h3>
                      <div className="space-y-8">
                        <label className="flex flex-col items-center justify-center w-full p-12 border-2 border-dashed border-white/5 rounded-[3rem] bg-black hover:border-green-500/50 hover:bg-green-500/5 transition-all cursor-pointer group">
                          <div className="flex flex-col items-center justify-center space-y-4">
                            <Send className="h-12 w-12 text-neutral-700 group-hover:text-green-500 transition-colors" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                              {submissionFile ? submissionFile.name : 'উত্তরপত্র (PDF/Image) নির্বাচন করুন'}
                            </p>
                          </div>
                          <input type="file" className="hidden" accept="image/*,application/pdf" onChange={(e) => setSubmissionFile(e.target.files?.[0] || null)} />
                        </label>

                        <button 
                          onClick={() => handleSubmitCQ(activeExam.id)}
                          disabled={!submissionFile || submitting}
                          className="w-full py-6 bg-green-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-green-700 transition-all shadow-2xl shadow-green-600/20 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          {submitting ? 'উপলোড হচ্ছে...' : 'উত্তরপত্র জমা দিন'}
                        </button>
                        
                        <button 
                            onClick={() => setActiveExam(null)}
                            className="w-full py-4 text-neutral-500 font-black uppercase tracking-widest text-[9px] hover:text-white transition-colors"
                        >
                            পরীক্ষা থেকে বের হোন (অটোমিটেড লগ আউট নয়)
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center p-10 bg-white/5 rounded-[3rem] border border-white/5">
                        <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-6" />
                        <h4 className="text-lg font-black text-white uppercase tracking-tight">MCQ পরীক্ষার জন্য শুধু গুগোল ফর্ম পূরণ করুন।</h4>
                        <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest mt-3 italic">আপনার উত্তর অটোমেটিক সেভ হবে।</p>
                        <button 
                            onClick={() => setActiveExam(null)}
                            className="mt-10 px-10 py-4 bg-white/5 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] border border-white/10 hover:bg-white/10"
                        >
                            বন্ধ করুন
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Overlays */}
      {showCreator && <ExamCreator courseId="quizblust" isQuizBlust onClose={() => setShowCreator(false)} />}
      {gradingExam && <SubmissionGrader exam={gradingExam} onClose={() => setGradingExam(null)} />}
    </div>
  );
}
