import React, { useState } from 'react';
import { db, collection, addDoc, serverTimestamp, storage, ref, uploadBytesResumable, getDownloadURL } from '../../lib/firebase';
import { useAuth } from '../../lib/AuthContext';
import { X, Save, Upload, Link as LinkIcon, Clock, Calendar, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface ExamCreatorProps {
  courseId: string;
  onClose: () => void;
  isQuizBlust?: boolean;
}

export default function ExamCreator({ courseId, onClose, isQuizBlust = false }: ExamCreatorProps) {
  const { user, profile } = useAuth();
  const [title, setTitle] = useState('');
  const [examType, setExamType] = useState<'CQ' | 'MCQ' | null>(null);
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState(60);
  const [googleFormLink, setGoogleFormLink] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSave = async () => {
    if (!title || !examType || !startTime || !duration) {
      alert('সবগুলো ঘর পূরণ করুন (Please fill all fields)');
      return;
    }

    if (examType === 'MCQ' && !googleFormLink) {
      alert('গুগল ফর্ম লিঙ্ক দিন (Provide Google Form Link)');
      return;
    }

    if (examType === 'CQ' && !file) {
      alert('সৃজনশীল প্রশ্নের ফাইল আপলোড করুন (Upload CQ file)');
      return;
    }

    if (profile?.role !== 'teacher' && profile?.role !== 'admin') {
      alert('আপনার এই কাজ করার অনুমতি নেই (Unauthorized: Teacher access only)');
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      let questionUrl = '';
      if (examType === 'CQ' && file) {
        const fileExtension = file.name.split('.').pop();
        const fileName = `${Date.now()}_exam_${title.replace(/\s+/g, '_')}.${fileExtension}`;
        const fileRef = ref(storage, `exams/${fileName}`);
        
        const uploadTask = uploadBytesResumable(fileRef, file);

        questionUrl = await new Promise((resolve, reject) => {
          uploadTask.on('state_changed', 
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(Math.round(progress));
            }, 
            (error) => {
              console.error("Upload error:", error);
              reject(error);
            }, 
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            }
          );
        });
      }

      await addDoc(collection(db, 'exams'), {
        title,
        courseId: isQuizBlust ? 'quizblust' : courseId,
        teacherId: user?.uid,
        examType,
        questionUrl: examType === 'CQ' ? questionUrl : null,
        googleFormLink: examType === 'MCQ' ? googleFormLink : null,
        startTime: new Date(startTime).toISOString(),
        durationMinutes: duration,
        status: 'scheduled',
        resultsReleased: false,
        createdAt: serverTimestamp(),
        isQuizBlust
      });

      alert('পরীক্ষা সফলভাবে শিডিউল করা হয়েছে (Exam scheduled!)');
      onClose();
    } catch (e: any) {
      console.error("Exam Creation Error:", e);
      alert(`ত্রুটি হয়েছে (Error): ${e.message || 'Unknown error occurred'}`);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#0a0a0a] w-full max-w-2xl min-h-screen sm:min-h-0 sm:rounded-[2.5rem] shadow-2xl border-x sm:border border-white/10 flex flex-col overflow-hidden"
      >
        <div className="p-6 sm:p-10 border-b border-white/5 flex justify-between items-center bg-black/40">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter">
              {isQuizBlust ? 'QuizBlust' : 'Course'} <span className="text-blue-500">Exam Setup</span>
            </h2>
            <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest mt-1">Configure Assessment Schedule</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
            <X className="h-5 w-5 text-neutral-500" />
          </button>
        </div>

        <div className="flex-grow p-6 sm:p-10 space-y-8 overflow-y-auto">
          {/* Exam Title */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Exam Title (পরীক্ষার নাম)</label>
            <input 
              type="text" 
              placeholder="e.g. Class 8 Monthly Test" 
              className="w-full px-6 py-4 bg-black border border-white/5 rounded-2xl focus:border-blue-500 outline-none transition-all text-white font-bold text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Exam Type Selection */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Exam Module (পরীক্ষার ধরণ)</label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setExamType('CQ')}
                className={`p-6 rounded-[1.5rem] border-2 transition-all flex flex-col items-center gap-3 ${
                  examType === 'CQ' ? 'border-blue-500 bg-blue-500/10' : 'border-white/5 bg-black hover:border-white/10'
                }`}
              >
                <FileText className={`h-6 w-6 ${examType === 'CQ' ? 'text-blue-500' : 'text-neutral-600'}`} />
                <span className={`text-[10px] font-black uppercase tracking-widest ${examType === 'CQ' ? 'text-white' : 'text-neutral-500'}`}>CQ (সৃজনশীল)</span>
              </button>
              <button 
                onClick={() => setExamType('MCQ')}
                className={`p-6 rounded-[1.5rem] border-2 transition-all flex flex-col items-center gap-3 ${
                  examType === 'MCQ' ? 'border-purple-500 bg-purple-500/10' : 'border-white/5 bg-black hover:border-white/10'
                }`}
              >
                <LinkIcon className={`h-6 w-6 ${examType === 'MCQ' ? 'text-purple-500' : 'text-neutral-600'}`} />
                <span className={`text-[10px] font-black uppercase tracking-widest ${examType === 'MCQ' ? 'text-white' : 'text-neutral-500'}`}>MCQ (গুগল ফর্ম)</span>
              </button>
            </div>
          </div>

          {examType === 'CQ' && (
            <div className="space-y-3">
              <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Question Paper (PDF/Image)</label>
              <label className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-white/10 rounded-2xl bg-black hover:border-blue-500/50 transition-all cursor-pointer group">
                <Upload className="h-8 w-8 text-neutral-700 group-hover:text-blue-500 mb-3" />
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                  {file ? file.name : 'Select Question File'}
                </p>
                <input type="file" className="hidden" accept="image/*,application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </label>
            </div>
          )}

          {examType === 'MCQ' && (
            <div className="space-y-3">
              <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Google Form Link</label>
              <input 
                type="url" 
                placeholder="https://docs.google.com/forms/..." 
                className="w-full px-6 py-4 bg-black border border-white/5 rounded-2xl focus:border-purple-500 outline-none transition-all text-white font-bold text-sm"
                value={googleFormLink}
                onChange={(e) => setGoogleFormLink(e.target.value)}
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Calendar className="h-3 w-3" /> Start Date & Time
              </label>
              <input 
                type="datetime-local" 
                className="w-full px-6 py-4 bg-black border border-white/5 rounded-2xl focus:border-blue-500 outline-none transition-all text-white font-bold text-sm [color-scheme:dark]"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Clock className="h-3 w-3" /> Duration (Minutes)
              </label>
              <input 
                type="number" 
                placeholder="60"
                className="w-full px-6 py-4 bg-black border border-white/5 rounded-2xl focus:border-blue-500 outline-none transition-all text-white font-bold text-sm"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-10 border-t border-white/5 bg-black/40">
          <button 
            onClick={handleSave}
            disabled={loading}
            className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50 flex flex-col items-center justify-center space-y-1"
          >
            <div className="flex items-center space-x-3">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>{loading ? 'Processing...' : 'Deploy Exam (পরীক্ষা তৈরি করুন)'}</span>
            </div>
            {loading && uploadProgress > 0 && uploadProgress < 100 && (
              <span className="text-[10px] opacity-70">UPLOADING: {uploadProgress}%</span>
            )}
            {loading && uploadProgress === 100 && (
              <span className="text-[10px] opacity-70">FINALIZING...</span>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

