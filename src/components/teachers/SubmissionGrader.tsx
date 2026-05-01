import React, { useState, useEffect } from 'react';
import { db, collection, query, where, getDocs, updateDoc, doc } from '../../lib/firebase';
import { X, Check, Save, FileText, User } from 'lucide-react';
import { motion } from 'motion/react';

interface SubmissionGraderProps {
  exam: any;
  onClose: () => void;
}

export default function SubmissionGrader({ exam, onClose }: SubmissionGraderProps) {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubmission, setActiveSubmission] = useState<any>(null);
  const [marks, setMarks] = useState<string>('');
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSubmissions = async () => {
      const q = query(
        collection(db, 'examSubmissions'), 
        where('examId', '==', exam.id)
      );
      const snap = await getDocs(q);
      const list: any[] = [];
      snap.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
      setSubmissions(list);
      setLoading(false);
    };
    fetchSubmissions();
  }, [exam.id]);

  const handleSaveGrade = async () => {
    if (!activeSubmission || !marks) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'examSubmissions', activeSubmission.id), {
        marks: parseFloat(marks),
        feedback,
        graded: true,
        gradedAt: new Date().toISOString()
      });
      
      setSubmissions(prev => prev.map(s => s.id === activeSubmission.id ? { 
        ...s, 
        marks: parseFloat(marks), 
        feedback, 
        graded: true 
      } : s));
      
      setActiveSubmission(null);
      setMarks('');
      setFeedback('');
    } catch (e) {
      alert('গ্রেডিং সেভ করতে ব্যর্থ হয়েছে।');
    } finally {
      setSaving(false);
    }
  };

  const releaseResults = async () => {
    if (!confirm('আপনি কি সব ফলাফল প্রকাশ করতে চান?')) return;
    try {
      await updateDoc(doc(db, 'exams', exam.id), {
        resultsReleased: true
      });
      alert('ফলাফল সফলভাবে প্রকাশিত হয়েছে!');
      onClose();
    } catch (e) {
      alert('ত্রুটি হয়েছে।');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[70] flex p-4 md:p-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-7xl mx-auto w-full flex flex-col bg-[#0a0a0a] rounded-[4rem] border border-white/5 shadow-2xl overflow-hidden"
      >
        <div className="p-10 border-b border-white/5 flex justify-between items-center bg-black/40">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">গ্রেডিং সেন্টার: {exam.title}</h2>
            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-1 italic">Tactical Grading Module // Submissions: {submissions.length}</p>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={releaseResults}
              className="px-8 py-4 bg-green-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-green-700 transition-all flex items-center gap-3"
            >
              <Check className="h-4 w-4" />
              <span>ফলাফল প্রকাশ করুন</span>
            </button>
            <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
              <X className="h-5 w-5 text-neutral-500" />
            </button>
          </div>
        </div>

        <div className="flex-grow flex overflow-hidden">
          {/* Submission List */}
          <div className="w-1/3 border-r border-white/5 overflow-y-auto bg-black/20">
            {loading ? (
              <div className="p-10 text-center text-neutral-600 font-black text-[10px] uppercase animate-pulse">খাতা স্ক্যান করা হচ্ছে...</div>
            ) : submissions.length === 0 ? (
              <div className="p-10 text-center text-neutral-600 font-black text-[10px] uppercase">কোনো খাতা জমা পড়েনি।</div>
            ) : (
              <div className="divide-y divide-white/5">
                {submissions.map((sub) => (
                  <button 
                    key={sub.id}
                    onClick={() => setActiveSubmission(sub)}
                    className={`w-full p-8 text-left transition-all hover:bg-white/[0.02] flex items-center justify-between group ${
                      activeSubmission?.id === sub.id ? 'bg-blue-600/10 border-l-4 border-blue-600' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-neutral-500 group-hover:text-blue-500">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-black text-white text-sm uppercase tracking-tight">{sub.studentName || 'Student'}</h4>
                        <p className="text-[8px] text-neutral-500 font-bold uppercase tracking-widest mt-0.5">
                          {new Date(sub.submittedAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    {sub.graded ? (
                      <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">খাতা দেখা শেষ</span>
                    ) : (
                      <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Grader Interface */}
          <div className="flex-grow overflow-y-auto bg-black/40 p-10">
            {activeSubmission ? (
              <div className="max-w-4xl mx-auto space-y-12">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">{activeSubmission.studentName}</h3>
                    <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">খাতা জমা দেওয়া হয়েছে: {new Date(activeSubmission.submittedAt).toLocaleString()}</p>
                  </div>
                  <a 
                    href={activeSubmission.ansUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 flex items-center gap-3"
                  >
                    <FileText className="h-4 w-4" />
                    <span>খাতা দেখুন (Open PDF)</span>
                  </a>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">প্রাপ্ত নম্বর (Marks)</label>
                    <input 
                      type="number" 
                      className="w-full px-8 py-5 bg-black border border-white/5 rounded-3xl focus:border-blue-500 outline-none transition-all text-white font-black text-xl tabular-nums shadow-inner"
                      value={marks}
                      onChange={(e) => setMarks(e.target.value)}
                      placeholder="00"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">মন্তব্য (Feedback)</label>
                    <textarea 
                      rows={3}
                      className="w-full px-8 py-5 bg-black border border-white/5 rounded-3xl focus:border-blue-500 outline-none transition-all text-white font-bold text-xs"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="খাতা সম্পর্কে আপনার মতামত লিখুন..."
                    />
                  </div>
                </div>

                <button 
                  onClick={handleSaveGrade}
                  disabled={saving || !marks}
                  className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/20 disabled:opacity-30 flex items-center justify-center gap-4"
                >
                  {saving ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save className="h-4 w-4" />}
                  <span>গ্রেড সেভ করুন</span>
                </button>

                <div className="p-10 bg-white/[0.01] rounded-[3rem] border border-white/5 min-h-[600px] flex items-center justify-center text-neutral-700 uppercase font-black text-xs italic">
                  খাতা দেখার জন্য উপরে 'খাতা দেখুন' বাটনে ক্লিক করুন। 
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-neutral-600">
                <FileText className="h-20 w-20 mb-8 opacity-20" />
                <h3 className="font-black uppercase tracking-[0.4em] text-[10px]">গ্রেডিং এর জন্য বাম পাশ থেকে একটি খাতা নির্বাচন করুন।</h3>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
