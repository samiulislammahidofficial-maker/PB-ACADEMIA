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
    <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">Create New Exam</h2>
            <p className="text-sm text-neutral-500">Design your assessment with mixed question types</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
            <X className="h-6 w-6 text-neutral-400" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Exam Title</label>
              <input 
                type="text" 
                placeholder="e.g. Midterm Assessment" 
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Duration (Minutes)</label>
              <input 
                type="number" 
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-neutral-900">Questions ({questions.length})</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => addQuestion('mcq')}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                >
                  <HelpCircle className="h-4 w-4" />
                  <span>+ MCQ</span>
                </button>
                <button 
                  onClick={() => addQuestion('short_answer')}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-xs font-bold hover:bg-purple-100 transition-colors"
                >
                  <Type className="h-4 w-4" />
                  <span>+ Short Ans</span>
                </button>
                <button 
                  onClick={() => addQuestion('creative')}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-xs font-bold hover:bg-orange-100 transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  <span>+ Creative</span>
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <AnimatePresence>
                {questions.map((q, idx) => (
                  <motion.div 
                    key={q.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200 relative group"
                  >
                    <button 
                      onClick={() => removeQuestion(q.id!)}
                      className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-black text-neutral-300">#{idx + 1}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          q.type === 'mcq' ? 'bg-blue-100 text-blue-700' : 
                          q.type === 'short_answer' ? 'bg-purple-100 text-purple-700' : 
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {q.type?.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Question Text</label>
                        <textarea 
                          rows={2}
                          className="w-full px-4 py-2 bg-white border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          value={q.text}
                          onChange={(e) => updateQuestion(q.id!, { text: e.target.value })}
                        />
                      </div>

                      {q.type === 'mcq' && q.options && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                          {q.options.map((opt, oIdx) => (
                            <div key={oIdx} className="flex items-center space-x-2">
                              <input 
                                type="radio" 
                                name={`correct-${q.id}`}
                                checked={q.correctOption === oIdx}
                                onChange={() => updateQuestion(q.id!, { correctOption: oIdx })}
                              />
                              <input 
                                type="text"
                                placeholder={`Option ${oIdx + 1}`}
                                className="flex-grow px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
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
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Expected Answer (Optional for grading help)</label>
                          <input 
                            type="text"
                            className="w-full px-4 py-2 bg-white border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            value={q.correctAnswer}
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

        <div className="p-6 border-t border-neutral-100 flex justify-end bg-neutral-50/50">
          <button 
            onClick={saveExam}
            disabled={loading}
            className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
          >
            <Save className="h-5 w-5" />
            <span>{loading ? 'Saving...' : 'Save Exam & Publish'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
