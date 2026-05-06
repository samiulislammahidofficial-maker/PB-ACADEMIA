import { useAuth } from '../lib/AuthContext';
import { practiceSets } from '../data/practiceQuestions';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, ChevronRight, Clock, Award, Brain } from 'lucide-react';

export default function PracticeExamList() {
  const { profile } = useAuth();
  
  // Convert profile class to number if necessary
  const userClassRaw = profile?.className || profile?.class;
  const userClass = typeof userClassRaw === 'string' ? parseInt(userClassRaw) : userClassRaw;

  // Default to class 8 if not specified to show something or handle empty
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  
  const classSets = practiceSets.filter(set => set.class === userClass);
  const subjects = ['All', ...Array.from(new Set(classSets.map(set => set.subject)))];
  
  const filteredSets = selectedSubject === 'All' 
    ? classSets 
    : classSets.filter(set => set.subject === selectedSubject);

  return (
    <div className="min-h-screen bg-[#050505] p-6 lg:p-20">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-blue-600/20 text-blue-500 border border-blue-600/30 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
            <Award className="h-3 w-3" />
            <span>Practice Hub</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mb-4">
            Practice <span className="text-blue-500">Exams</span>
          </h1>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs">
              Class {userClass} • Improve your skills with board-standard MCQ sets
            </p>
            
            {/* Subject Filters */}
            <div className="flex flex-wrap gap-2">
              {subjects.map(subject => (
                <button
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                    selectedSubject === subject
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : 'bg-white/5 text-neutral-500 hover:bg-white/10 hover:text-neutral-400'
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>
        </header>

        {filteredSets.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSets.map((set, i) => (
              <motion.div
                key={set.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 group hover:border-blue-500/50 transition-all flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="h-12 w-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div className="flex items-center space-x-2 text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                    <Clock className="h-3 w-3" />
                    <span>{set.durationMinutes} Mins</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-black text-white mb-4 leading-tight group-hover:text-blue-500 transition-colors">
                  {set.title}
                </h3>
                
                <div className="mt-auto pt-8 flex items-center justify-between">
                  <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black text-neutral-400 uppercase tracking-widest">
                    {set.questions.length} Questions
                  </span>
                  <Link 
                    to={`/practice-exams/${set.id}`}
                    className="h-10 w-10 bg-white/5 group-hover:bg-blue-600 rounded-full flex items-center justify-center text-white transition-all transform group-hover:translate-x-1"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 border-2 border-dashed border-white/5 rounded-[4rem]">
            <Brain className="h-16 w-16 text-neutral-800 mx-auto mb-8 animate-pulse" />
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">No content found</h3>
            <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">
              We are currently preparing sets for your class. Check back later!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
