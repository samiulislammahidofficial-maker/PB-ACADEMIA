import React, { useState } from 'react';
import { db, collection, addDoc, serverTimestamp, storage, ref, uploadBytes, getDownloadURL } from '../../lib/firebase';
import { useAuth } from '../../lib/AuthContext';
import { X, Save, Upload, Link as LinkIcon, Clock, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface ExamCreatorProps {
  courseId: string;
  onClose: () => void;
  isQuizBlust?: boolean;
}

export default function ExamCreator({ courseId, onClose, isQuizBlust = false }: ExamCreatorProps) {
  const { user } = useAuth();
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
      alert('Please fill all required fields');
      return;
    }

    if (examType === 'MCQ' && !googleFormLink) {
      alert('Please provide a Google Form link for MCQ exam');
      return;
    }

    if (examType === 'CQ' && !file) {
      alert('Please upload an exam question file (PDF or Image) for CQ');
      return;
    }

    setLoading(true);
    try {
      let questionUrl = '';
      if (examType === 'CQ' && file) {
        const fileRef = ref(storage, `exams/${Date.now()}_${file.name}`);
        const uploadResult = await uploadBytes(fileRef, file);
        questionUrl = await getDownloadURL(uploadResult.ref);
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

      alert('Exam scheduled successfully');
      onClose();
    } catch (e) {
      console.error(e);
      alert('Failed to schedule exam');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-2xl z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0a0a0a] w-full max-w-2xl rounded-[3rem] shadow-2xl border border-white/5 flex flex-col overflow-hidden max-h-[90vh]"
      >
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/40">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
              {isQuizBlust ? 'QuizBlust' : 'Course'} <span className="text-blue-500">Exam Deployment</span>
            </h2>
            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-1">Configure Assessment Protocol</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
            <X className="h-5 w-5 text-neutral-500" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-8 space-y-8">
          {/* Step 1: Exam Title */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Exam Title</label>
            <input 
              type="text" 
              placeholder="e.g. Physics Midterm Assessment" 
              className="w-full px-6 py-4 bg-black border border-white/5 rounded-2xl focus:border-blue-500 outline-none transition-all text-white font-bold uppercase tracking-widest text-xs"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Step 2: Exam Type Selection */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Assessment Architecture</label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setExamType('CQ')}
                className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 ${
                  examType === 'CQ' ? 'border-blue-500 bg-blue-500/10' : 'border-white/5 bg-black hover:border-white/10'
                }`}
              >
                <div className={`p-4 rounded-2xl ${examType === 'CQ' ? 'bg-blue-500 text-white' : 'bg-white/5 text-neutral-500'}`}>
                  <FileText className="h-6 w-6" />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${examType === 'CQ' ? 'text-white' : 'text-neutral-500'}`}>CQ (Written)</span>
              </button>
              <button 
                onClick={() => setExamType('MCQ')}
                className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 ${
                  examType === 'MCQ' ? 'border-purple-500 bg-purple-500/10' : 'border-white/5 bg-black hover:border-white/10'
                }`}
              >
                <div className={`p-4 rounded-2xl ${examType === 'MCQ' ? 'bg-purple-500 text-white' : 'bg-white/5 text-neutral-500'}`}>
                  <LinkIcon className="h-6 w-6" />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${examType === 'MCQ' ? 'text-white' : 'text-neutral-500'}`}>MCQ (External Unit)</span>
              </button>
            </div>
          </div>

          {/* Step 3: Specific Content */}
          {examType === 'CQ' && (
            <div className="space-y-3">
              <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Upload Question Paper (PDF/Image)</label>
              <label className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-white/5 rounded-3xl bg-black hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer group">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <Upload className="h-10 w-10 text-neutral-700 group-hover:text-blue-500 transition-colors" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                    {file ? file.name : 'Select or drop asset file'}
                  </p>
                </div>
                <input type="file" className="hidden" accept="image/*,application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </label>
            </div>
          )}

          {examType === 'MCQ' && (
            <div className="space-y-3">
              <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Google Form Integration Link</label>
              <div className="relative">
                <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                <input 
                  type="url" 
                  placeholder="https://docs.google.com/forms/..." 
                  className="w-full pl-14 pr-6 py-4 bg-black border border-white/5 rounded-2xl focus:border-purple-500 outline-none transition-all text-white font-bold text-xs"
                  value={googleFormLink}
                  onChange={(e) => setGoogleFormLink(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 4: Schedule */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Calendar className="h-3 w-3" /> Start Chronology
              </label>
              <input 
                type="datetime-local" 
                className="w-full px-6 py-4 bg-black border border-white/5 rounded-2xl focus:border-blue-500 outline-none transition-all text-white font-bold text-xs [color-scheme:dark]"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Clock className="h-3 w-3" /> Runtime Duration (Mins)
              </label>
              <input 
                type="number" 
                placeholder="60"
                className="w-full px-6 py-4 bg-black border border-white/5 rounded-2xl focus:border-blue-500 outline-none transition-all text-white font-bold text-xs"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-white/5 bg-black/40">
          <button 
            onClick={handleSave}
            disabled={loading}
            className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center space-x-3"
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{loading ? 'Initializing Protocol...' : 'Finalize Exam Deployment'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

