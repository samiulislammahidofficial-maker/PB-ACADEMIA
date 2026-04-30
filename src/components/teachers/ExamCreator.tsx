import React, { useState } from 'react';
import { db, collection, addDoc, serverTimestamp } from '../../lib/firebase';
import { useAuth } from '../../lib/AuthContext';
import { Question, QuestionType } from '../../types';
import { Plus, Trash2, Save, X, HelpCircle, FileText, Type } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ExamCreatorProps {
  courseId: string;
  onClose: () => void;
}

export default function ExamCreator({ courseId, onClose }: ExamCreatorProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(30);
  const [questions, setQuestions] = useState<Partial<Question>[]>([]);
  const [loading, setLoading] = useState(false);

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Partial<Question> = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      text: '',
      points: 5,
    };

    if (type === 'mcq') {
      newQuestion.options = ['', '', '', ''];
      newQuestion.correctOption = 0;
    } else if (type === 'short_answer') {
      newQuestion.correctAnswer = '';
    }

    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const saveExam = async () => {
    if (!title || questions.length === 0) {
      alert('Please provide a title and at least one question');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'exams'), {
        title,
        courseId,
        teacherId: user?.uid,
        durationMinutes: duration,
        questions,
        createdAt: serverTimestamp()
      });
      onClose();
    } catch (e) {
      console.error(e);
      alert('Failed to save exam');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#0a0a0a] w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl border border-white/5 flex flex-col overflow-hidden"
      >
        <div className="p-10 border-b border-white/5 flex justify-between items-center bg-[#0a0a0a]/50 backdrop-blur-md sticky top-0 z-10">
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Tactical <span className="text-blue-500">Assessment</span> Designer</h2>
            <p className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.3em] mt-2 italic">Operation: Evaluation Core // CourseID-{courseId.slice(0,6)}</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all group">
            <X className="h-6 w-6 text-neutral-500 group-hover:text-white transition-colors" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-10 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">Operational Title</label>
              <input 
                type="text" 
                placeholder="e.g. ALPHA_SYNC_01" 
                className="w-full px-6 py-4 bg-black border border-white/5 rounded-2xl focus:border-blue-500 outline-none transition-all text-white font-black uppercase tracking-widest text-[10px] placeholder:text-neutral-800 shadow-inner"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">Window Duration (Units)</label>
              <input 
                type="number" 
                className="w-full px-6 py-4 bg-black border border-white/5 rounded-2xl focus:border-blue-500 outline-none transition-all text-white font-black uppercase tracking-widest text-[10px] shadow-inner"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <h3 className="font-black text-white uppercase tracking-widest text-sm flex items-center">
                <div className="h-2 w-2 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                Question Array ({questions.length})
              </h3>
              <div className="flex gap-3">
                <button 
                  onClick={() => addQuestion('mcq')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all"
                >
                  <HelpCircle className="h-4 w-4" />
                  <span>+ MCQ</span>
                </button>
                <button 
                  onClick={() => addQuestion('short_answer')}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-500/10 text-purple-500 border border-purple-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all"
                >
                  <Type className="h-4 w-4" />
                  <span>+ ANALYTIC</span>
                </button>
                <button 
                  onClick={() => addQuestion('creative')}
                  className="flex items-center space-x-2 px-4 py-2 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all"
                >
                  <FileText className="h-4 w-4" />
                  <span>+ CREATIVE</span>
                </button>
              </div>
            </div>

            <div className="space-y-8">
              <AnimatePresence>
                {questions.map((q, idx) => (
                  <motion.div 
                    key={q.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-8 bg-black/40 rounded-[2.5rem] border border-white/5 relative group hover:border-white/10 transition-all shadow-2xl"
                  >
                    <button 
                      onClick={() => removeQuestion(q.id!)}
                      className="absolute top-6 right-6 p-3 bg-red-500/5 text-red-500/50 hover:bg-red-500 hover:text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-2xl"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <div className="space-y-6">
                      <div className="flex items-center space-x-4">
                        <span className="text-[10px] font-black text-neutral-800 uppercase tabular-nums">DATA_POINT_{idx + 1}</span>
                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] ${
                          q.type === 'mcq' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 
                          q.type === 'short_answer' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' : 
                          'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                        }`}>
                          {q.type?.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[9px] font-black text-neutral-600 uppercase tracking-[0.3em]">Intelligence Parameter</label>
                        <textarea 
                          rows={3}
                          className="w-full px-6 py-4 bg-black border border-white/5 rounded-2xl focus:border-blue-500 outline-none transition-all text-white font-black uppercase tracking-widest text-[10px] placeholder:text-neutral-800 shadow-inner"
                          value={q.text}
                          placeholder="Input Directive Content..."
                          onChange={(e) => updateQuestion(q.id!, { text: e.target.value })}
                        />
                      </div>

                      {q.type === 'mcq' && q.options && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                          {q.options.map((opt, oIdx) => (
                            <div key={oIdx} className="flex items-center space-x-4 bg-black/50 p-4 rounded-xl border border-white/5 group/opt hover:border-white/20 transition-all shadow-inner">
                              <input 
                                type="radio" 
                                name={`correct-${q.id}`}
                                className="accent-blue-500 w-4 h-4"
                                checked={q.correctOption === oIdx}
                                onChange={() => updateQuestion(q.id!, { correctOption: oIdx })}
                              />
                              <input 
                                type="text"
                                placeholder={`Neural Path ${oIdx + 1}`}
                                className="flex-grow bg-transparent outline-none text-white font-black uppercase tracking-widest text-[9px] placeholder:text-neutral-800"
                                value={opt}
                                onChange={(e) => {
                                  const newOpts = [...q.options!];
                                  newOpts[oIdx] = e.target.value;
                                  updateQuestion(q.id!, { options: newOpts });
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {q.type === 'short_answer' && (
                        <div className="space-y-3">
                          <label className="text-[9px] font-black text-neutral-600 uppercase tracking-[0.3em]">Validation Encryption (Optional)</label>
                          <input 
                            type="text"
                            className="w-full px-6 py-4 bg-black border border-white/5 rounded-2xl focus:border-blue-500 outline-none transition-all text-white font-black uppercase tracking-widest text-[10px] shadow-inner"
                            value={q.correctAnswer}
                            placeholder="Static Result Hash..."
                            onChange={(e) => updateQuestion(q.id!, { correctAnswer: e.target.value })}
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="p-10 border-t border-white/5 flex justify-end bg-black/40 backdrop-blur-md">
          <button 
            onClick={saveExam}
            disabled={loading}
            className="flex items-center space-x-4 px-12 py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/30 disabled:opacity-50 group active:scale-95"
          >
            <Save className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span>{loading ? 'Encrypting Array...' : 'Commit to Database'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
